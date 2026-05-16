import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');

    if (!sessionId) {
      return NextResponse.json(
        { error: '缺少 session id' },
        { status: 400 }
      );
    }

    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { error: '未找到测试记录' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      session: {
        id: session.id,
        mode: session.mode,
        mbtiType: session.mbti_type,
        dimensionScores: session.dimension_scores,
        shareCode: session.share_code,
        unlockedModules: session.unlocked_modules,
        referralCount: session.referral_count,
        referrerId: session.referrer_id,
        createdAt: session.created_at,
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
