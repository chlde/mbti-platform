// Cloudflare Pages Function: GET /api/query-session
// Replaces Next.js API route for static export deployment

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;

  try {
    const url = new URL(context.request.url);
    const sessionId = url.searchParams.get('id');

    if (!sessionId) {
      return new Response(JSON.stringify({ error: '缺少 session id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/sessions?id=eq.${sessionId}&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    const data = await res.json();
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: '未找到测试记录' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = data[0];

    return new Response(
      JSON.stringify({
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
          answers: session.answers || null,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get session error:', error);
    return new Response(JSON.stringify({ error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
