// Cloudflare Pages Function: POST /api/session
// Replaces Next.js API route for static export deployment

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

interface Answer {
  questionId: number;
  choice: 'A' | 'B';
}

interface Question {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  weightA: 'left' | 'right';
}

// Inline question dimension/weight mapping (must match question-bank-free.ts)
// Format: [dimension, weightA] per questionId (1-indexed)
const QUESTION_MAP: Record<number, [string, string]> = {
  1: ['EI', 'left'], 2: ['EI', 'left'], 3: ['EI', 'left'], 4: ['EI', 'left'], 5: ['EI', 'left'], 6: ['EI', 'left'], 7: ['EI', 'left'],
  8: ['SN', 'left'], 9: ['SN', 'left'], 10: ['SN', 'left'], 11: ['SN', 'left'], 12: ['SN', 'left'], 13: ['SN', 'left'], 14: ['SN', 'left'],
  15: ['TF', 'left'], 16: ['TF', 'left'], 17: ['TF', 'left'], 18: ['TF', 'left'], 19: ['TF', 'left'], 20: ['TF', 'left'], 21: ['TF', 'left'],
  22: ['JP', 'left'], 23: ['JP', 'left'], 24: ['JP', 'left'], 25: ['JP', 'left'], 26: ['JP', 'left'], 27: ['JP', 'left'], 28: ['JP', 'left'],
};

const DIMENSION_LEFT: Record<string, string> = { EI: 'E', SN: 'S', TF: 'T', JP: 'J' };
const DIMENSION_RIGHT: Record<string, string> = { EI: 'I', SN: 'N', TF: 'F', JP: 'P' };
const DIMENSIONS = ['EI', 'SN', 'TF', 'JP'];

function calculateMBTI(answers: Answer[]) {
  const counts: Record<string, { left: number; right: number }> = {};
  for (const dim of DIMENSIONS) {
    counts[dim] = { left: 0, right: 0 };
  }

  for (const answer of answers) {
    const qInfo = QUESTION_MAP[answer.questionId];
    if (!qInfo) continue;
    const [dim, weightA] = qInfo;
    const isLeft = answer.choice === 'A' ? weightA === 'left' : weightA !== 'left';
    if (isLeft) {
      counts[dim].left += 1;
    } else {
      counts[dim].right += 1;
    }
  }

  const dimensions: Record<string, any> = {};
  for (const dim of DIMENSIONS) {
    const { left, right } = counts[dim];
    const total = left + right;
    const ratio = total === 0 ? 0.5 : right / total;
    const leftPct = total === 0 ? 50 : Math.round((left / total) * 100);
    const rightPct = total === 0 ? 50 : Math.round((right / total) * 100);
    const winner = ratio > 0.5 ? DIMENSION_RIGHT[dim] : DIMENSION_LEFT[dim];
    dimensions[dim] = { ratio, left: leftPct, right: rightPct, winner, answered: total };
  }

  const type = DIMENSIONS.map(d => dimensions[d].winner).join('');
  return { type, dimensions };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;

  try {
    const body = await context.request.json();
    const { answers, referrerCode } = body as {
      answers: Answer[];
      referrerCode?: string;
    };

    if (!Array.isArray(answers) || answers.length === 0) {
      return new Response(JSON.stringify({ error: '无效的答题数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate MBTI result
    const result = calculateMBTI(answers);

    // Resolve referrer
    let referrerId: string | null = null;
    if (referrerCode) {
      const refRes = await fetch(
        `${SUPABASE_URL}/rest/v1/sessions?select=id&share_code=eq.${referrerCode}`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      const refData = await refRes.json();
      if (refData.length > 0) {
        referrerId = refData[0].id;
      }
    }

    // Insert session
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        mode: 'free',
        answers: answers,
        mbti_type: result.type,
        dimension_scores: result.dimensions,
        referrer_id: referrerId,
      }),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error('DB insert error:', errText);
      return new Response(JSON.stringify({ error: '保存结果失败，请重试' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = (await insertRes.json())[0];

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        shareCode: session.share_code,
        result: {
          type: result.type,
          dimensions: result.dimensions,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Save session error:', error);
    return new Response(JSON.stringify({ error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
