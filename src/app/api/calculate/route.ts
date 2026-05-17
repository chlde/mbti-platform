import { NextRequest, NextResponse } from 'next/server';
import { calculateMBTI, Answer, MBTIResult } from '@/lib/mbti-calculator';
import { typeDescriptions, TypeDescription } from '@/lib/type-descriptions';

interface CalculateRequest {
  answers: Answer[];
}

interface CalculateResponse {
  result: MBTIResult;
  description: TypeDescription;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: unknown = await request.json();

    // Validate body structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: '请求体格式错误' },
        { status: 400 },
      );
    }

    const { answers } = body as CalculateRequest;

    // Validate answers array
    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'answers 必须是数组' },
        { status: 400 },
      );
    }

    if (answers.length === 0) {
      return NextResponse.json(
        { error: 'answers 不能为空' },
        { status: 400 },
      );
    }

    // Validate each answer
    for (let i = 0; i < answers.length; i++) {
      const a = answers[i];
      if (
        !a ||
        typeof a.questionId !== 'number' ||
        ![1, 2, 3, 4, 5].includes(a.choice)
      ) {
        return NextResponse.json(
          { error: `第 ${i + 1} 个答案格式错误` },
          { status: 400 },
        );
      }
    }

    // Calculate MBTI result
    const result = calculateMBTI(answers);

    // Look up type description
    const description = typeDescriptions[result.type];

    if (!description) {
      return NextResponse.json(
        { error: `未找到类型 ${result.type} 的描述` },
        { status: 500 },
      );
    }

    const response: CalculateResponse = { result, description };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[calculate] Error:', error);
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 },
    );
  }
}
