// Cloudflare Pages Function: POST /api/session
// Replaces Next.js API route for static export deployment

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;

  try {
    const body = await context.request.json();
    const { answers, referrerCode } = body as {
      answers: { questionId: number; selectedOption: string }[];
      referrerCode?: string;
    };

    if (!Array.isArray(answers) || answers.length === 0) {
      return new Response(JSON.stringify({ error: '无效的答题数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate MBTI from answers
    // E/I dimension
    const eiScore = answers
      .filter((a: any) => a.questionId <= 7)
      .reduce((sum: number, a: any) => sum + (a.selectedOption === 'A' ? 1 : -1), 0);
    // S/N dimension
    const snScore = answers
      .filter((a: any) => a.questionId >= 8 && a.questionId <= 14)
      .reduce((sum: number, a: any) => sum + (a.selectedOption === 'A' ? 1 : -1), 0);
    // T/F dimension
    const tfScore = answers
      .filter((a: any) => a.questionId >= 15 && a.questionId <= 21)
      .reduce((sum: number, a: any) => sum + (a.selectedOption === 'A' ? 1 : -1), 0);
    // J/P dimension
    const jpScore = answers
      .filter((a: any) => a.questionId >= 22)
      .reduce((sum: number, a: any) => sum + (a.selectedOption === 'A' ? 1 : -1), 0);

    const mbtiType =
      (eiScore >= 0 ? 'E' : 'I') +
      (snScore >= 0 ? 'S' : 'N') +
      (tfScore >= 0 ? 'T' : 'F') +
      (jpScore >= 0 ? 'J' : 'P');

    const dimensions = { EI: eiScore, SN: snScore, TF: tfScore, JP: jpScore };

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
        mbti_type: mbtiType,
        dimension_scores: dimensions,
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
          type: mbtiType,
          dimensions: dimensions,
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
