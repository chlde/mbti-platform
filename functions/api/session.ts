// Cloudflare Pages Function: POST /api/session
// Supports 5-option Likert scale answers

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

interface Answer {
  questionId: number;
  choice: 1 | 2 | 3 | 4 | 5;
}

interface QuestionInfo {
  dimension: string;
  weightA: string;
}

// Full question bank mapping: id → {dimension, weightA}
// Must match question-bank-free.ts (56 questions)
const QUESTION_MAP: Record<number, QuestionInfo> = {
  // EI dimension (id 1-14)
  1: {dimension:'EI',weightA:'left'}, 2: {dimension:'EI',weightA:'left'},
  3: {dimension:'EI',weightA:'left'}, 4: {dimension:'EI',weightA:'left'},
  5: {dimension:'EI',weightA:'left'}, 6: {dimension:'EI',weightA:'left'},
  7: {dimension:'EI',weightA:'left'}, 8: {dimension:'EI',weightA:'left'},
  9: {dimension:'EI',weightA:'left'}, 10: {dimension:'EI',weightA:'left'},
  11: {dimension:'EI',weightA:'left'}, 12: {dimension:'EI',weightA:'left'},
  13: {dimension:'EI',weightA:'left'}, 14: {dimension:'EI',weightA:'left'},
  // SN dimension (id 15-28)
  15: {dimension:'SN',weightA:'left'}, 16: {dimension:'SN',weightA:'left'},
  17: {dimension:'SN',weightA:'left'}, 18: {dimension:'SN',weightA:'left'},
  19: {dimension:'SN',weightA:'left'}, 20: {dimension:'SN',weightA:'left'},
  21: {dimension:'SN',weightA:'left'}, 22: {dimension:'SN',weightA:'left'},
  23: {dimension:'SN',weightA:'left'}, 24: {dimension:'SN',weightA:'left'},
  25: {dimension:'SN',weightA:'left'}, 26: {dimension:'SN',weightA:'left'},
  27: {dimension:'SN',weightA:'left'}, 28: {dimension:'SN',weightA:'left'},
  // TF dimension (id 29-42)
  29: {dimension:'TF',weightA:'left'}, 30: {dimension:'TF',weightA:'left'},
  31: {dimension:'TF',weightA:'left'}, 32: {dimension:'TF',weightA:'left'},
  33: {dimension:'TF',weightA:'left'}, 34: {dimension:'TF',weightA:'left'},
  35: {dimension:'TF',weightA:'left'}, 36: {dimension:'TF',weightA:'left'},
  37: {dimension:'TF',weightA:'left'}, 38: {dimension:'TF',weightA:'left'},
  39: {dimension:'TF',weightA:'left'}, 40: {dimension:'TF',weightA:'left'},
  41: {dimension:'TF',weightA:'left'}, 42: {dimension:'TF',weightA:'left'},
  // JP dimension (id 43-56)
  43: {dimension:'JP',weightA:'left'}, 44: {dimension:'JP',weightA:'left'},
  45: {dimension:'JP',weightA:'left'}, 46: {dimension:'JP',weightA:'left'},
  47: {dimension:'JP',weightA:'left'}, 48: {dimension:'JP',weightA:'left'},
  49: {dimension:'JP',weightA:'left'}, 50: {dimension:'JP',weightA:'left'},
  51: {dimension:'JP',weightA:'left'}, 52: {dimension:'JP',weightA:'left'},
  53: {dimension:'JP',weightA:'left'}, 54: {dimension:'JP',weightA:'left'},
  55: {dimension:'JP',weightA:'left'}, 56: {dimension:'JP',weightA:'left'},
};

const TOTAL_QUESTIONS = 28;

const DIMENSION_LEFT: Record<string, string> = { EI: 'E', SN: 'S', TF: 'T', JP: 'J' };
const DIMENSION_RIGHT: Record<string, string> = { EI: 'I', SN: 'N', TF: 'F', JP: 'P' };
const DIMENSIONS = ['EI', 'SN', 'TF', 'JP'];

function calculateMBTI(answers: Answer[]) {
  // Use weighted scoring for 5-option Likert scale
  const scores: Record<string, { left: number; right: number; answered: number }> = {};
  for (const dim of DIMENSIONS) {
    scores[dim] = { left: 0, right: 0, answered: 0 };
  }

  for (const answer of answers) {
    const qInfo = QUESTION_MAP[answer.questionId];
    if (!qInfo) continue;
    const { dimension: dim, weightA } = qInfo;

    let aWeight = 0;
    let bWeight = 0;
    switch (answer.choice) {
      case 1: aWeight = 2.0; break;
      case 2: aWeight = 1.0; break;
      case 3: aWeight = 0.5; bWeight = 0.5; break;
      case 4: bWeight = 1.0; break;
      case 5: bWeight = 2.0; break;
    }

    if (weightA === 'left') {
      scores[dim].left += aWeight;
      scores[dim].right += bWeight;
    } else {
      scores[dim].left += bWeight;
      scores[dim].right += aWeight;
    }
    scores[dim].answered += 1;
  }

  const dimensions: Record<string, any> = {};
  for (const dim of DIMENSIONS) {
    const { left, right, answered } = scores[dim];
    const total = left + right;
    const ratio = total === 0 ? 0.5 : right / total;
    const leftPct = total === 0 ? 50 : Math.round((left / total) * 100);
    const rightPct = total === 0 ? 50 : Math.round((right / total) * 100);
    const winner = ratio > 0.5 ? DIMENSION_RIGHT[dim] : DIMENSION_LEFT[dim];
    dimensions[dim] = { ratio, left: leftPct, right: rightPct, winner, answered };
  }

  const type = DIMENSIONS.map(d => dimensions[d].winner).join('');
  return { type, dimensions };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;

  try {
    const body = await context.request.json();
    const { answers, referrerCode, questionIds } = body as {
      answers: Answer[];
      referrerCode?: string;
      questionIds?: number[];
    };

    if (!Array.isArray(answers) || answers.length === 0) {
      return new Response(JSON.stringify({ error: '无效的答题数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (answers.length !== TOTAL_QUESTIONS) {
      return new Response(JSON.stringify({ error: `需要完成全部 ${TOTAL_QUESTIONS} 道题目` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate choice values
    for (const a of answers) {
      if (![1, 2, 3, 4, 5].includes(a.choice)) {
        return new Response(JSON.stringify({ error: '无效的选项值' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

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
