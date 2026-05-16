import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateMBTI, Answer } from '@/lib/mbti-calculator';
import { freeQuestions } from '@/lib/question-bank-free';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, referrerCode } = body as {
      answers: Answer[];
      referrerCode?: string;
    };

    // Validate answers
    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: '无效的答题数据' },
        { status: 400 }
      );
    }

    // Validate answer count matches free question bank
    if (answers.length !== freeQuestions.length) {
      return NextResponse.json(
        { error: `需要完成全部 ${freeQuestions.length} 道题目` },
        { status: 400 }
      );
    }

    // Calculate MBTI result
    const result = calculateMBTI(answers);

    // Resolve referrer_id from share code
    let referrerId: string | null = null;
    if (referrerCode) {
      const { data: referrer } = await supabase
        .from('sessions')
        .select('id')
        .eq('share_code', referrerCode)
        .single();
      
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Insert session into database
    const { data: session, error: dbError } = await supabase
      .from('sessions')
      .insert({
        mode: 'free',
        answers: answers,
        mbti_type: result.type,
        dimension_scores: result.dimensions,
        referrer_id: referrerId,
      })
      .select('id, share_code')
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json(
        { error: '保存结果失败，请重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      shareCode: session.share_code,
      result: {
        type: result.type,
        dimensions: result.dimensions,
      },
    });
  } catch (error) {
    console.error('Save session error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
