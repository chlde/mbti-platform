'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState, useCallback, useEffect, Suspense } from 'react';
import { calculateMBTI, Answer, MBTIResult, Dimension } from '@/lib/mbti-calculator';
import { typeDescriptions, TypeDescription } from '@/lib/type-descriptions';
import ResultCard from '@/components/ResultCard';
import SharePoster from '@/components/SharePoster';

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Share-to-unlock state: 'locked' → 'sharing' → 'unlocked'
  const [phase, setPhase] = useState<'locked' | 'sharing' | 'unlocked'>('locked');
  const [showToast, setShowToast] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [copied, setCopied] = useState(false);
  const [serverShareCode, setServerShareCode] = useState<string>('');

  // Dynamically update OG meta tags based on MBTI result
  useEffect(() => {
    let answers: Answer[] | null = null;

    // Try sessionStorage first (new flow)
    const sessionData = sessionStorage.getItem('mbti-answers');
    if (sessionData) {
      try {
        answers = JSON.parse(sessionData);
      } catch {
        // fall through to URL
      }
    }

    // Fallback: decode from URL param (old links)
    if (!answers) {
      const encoded = searchParams.get('answers');
      if (encoded) {
        try {
          const json = decodeURIComponent(escape(atob(encoded)));
          answers = JSON.parse(json);
        } catch {
          return;
        }
      }
    }

    if (!answers) return;
    try {
      const mbtiResult = calculateMBTI(answers);
      const desc = typeDescriptions[mbtiResult.type];
      if (!desc) return;

      const title = `我是${mbtiResult.type}「${desc.name}」——快来测测你的MBTI人格！`;
      const descText = `${desc.tag}。28道精选题目，3分钟发现你的MBTI人格类型。`;

      // Update document title
      document.title = `${mbtiResult.type}「${desc.name}」| MBTI 人格测试`;

      // Update or create OG meta tags
      const setMeta = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.content = content;
      };

      setMeta('og:title', title);
      setMeta('og:description', descText);
      setMeta('og:image', `${window.location.origin}/og-image.png`);

      // Twitter card
      let twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement;
      if (!twitterTitle) {
        twitterTitle = document.createElement('meta');
        twitterTitle.name = 'twitter:title';
        document.head.appendChild(twitterTitle);
      }
      twitterTitle.content = title;
    } catch {
      // silently fail
    }
  }, [searchParams]);

  // Decode answers from sessionStorage (primary) or URL fallback, then calculate result
  const { result, description, error } = useMemo(() => {
    let answers: Answer[] | null = null;

    // Try sessionStorage first (new flow)
    const sessionData = sessionStorage.getItem('mbti-answers');
    if (sessionData) {
      try {
        answers = JSON.parse(sessionData);
        // Clear after reading so it's not reused on refresh
        sessionStorage.removeItem('mbti-answers');
      } catch {
        // fall through to URL fallback
      }
    }

    // Fallback: decode from URL param (backward compatibility for old links)
    if (!answers) {
      const encoded = searchParams.get('answers');
      if (!encoded) {
        return { result: null, description: null, error: '未找到测试结果，请重新开始测试。' };
      }

      try {
        const json = decodeURIComponent(escape(atob(encoded)));
        answers = JSON.parse(json);
      } catch {
        return { result: null, description: null, error: '测试数据解析失败，请重新开始测试。' };
      }
    }

    try {
      if (!Array.isArray(answers) || answers.length === 0) {
        return { result: null, description: null, error: '测试数据为空，请重新开始测试。' };
      }

      const mbtiResult: MBTIResult = calculateMBTI(answers);
      const desc: TypeDescription | undefined = typeDescriptions[mbtiResult.type];

      if (!desc) {
        return { result: null, description: null, error: '未知的人格类型，请重新测试。' };
      }

      return { result: mbtiResult, description: desc, error: null };
    } catch {
      return { result: null, description: null, error: '测试数据解析失败，请重新开始测试。' };
    }
  }, [searchParams]);

  // Fetch server-side session data (share code, referral count)
  useEffect(() => {
    const sessionId = searchParams.get('s');
    if (sessionId) {
      fetch(`/api/query-session?id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.session?.shareCode) {
            setServerShareCode(data.session.shareCode);
          }
        })
        .catch(() => {
          // Silently fail — will use client-side fallback
        });
    }
  }, [searchParams]);

  const shareCode = serverShareCode || useMemo(() => {
    if (!result) return '';
    return btoa(result.type).replace(/=/g, '').slice(0, 6);
  }, [result, serverShareCode]);

  const handleShare = useCallback((platform: string) => {
    // Simulate share action
    setShowToast(true);
    setPhase('sharing');

    // After 1.5s, reveal the full result
    setTimeout(() => {
      setPhase('unlocked');
      setShowToast(false);

      // After another 0.5s, show the poster section
      setTimeout(() => {
        setShowPoster(true);
      }, 500);
    }, 1500);

    // For copy link, actually copy
    if (platform === 'copy') {
      const url = `${window.location.origin}?ref=${shareCode}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }, [shareCode]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">出错了</h1>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-2xl bg-btn-gradient text-white font-semibold text-sm shadow-lg shadow-purple-200/50 active:scale-[0.97] transition-transform"
          >
            重新开始测试
          </button>
        </div>
      </div>
    );
  }

  if (!result || !description) return null;

  return (
    <div className="min-h-screen pb-12">
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="px-5 py-3 rounded-2xl bg-green-500 text-white text-sm font-semibold shadow-xl shadow-green-200/50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            分享成功！正在解锁完整结果...
          </div>
        </div>
      )}

      {/* Copied toast */}
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="px-5 py-3 rounded-2xl bg-gray-800 text-white text-sm font-semibold shadow-xl">
            链接已复制到剪贴板 ✅
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-6 pb-2 px-5 text-center">
        <h1 className="text-lg font-bold text-gray-800">你的 MBTI 人格画像</h1>
        <p className="text-xs text-gray-400 mt-1">基于 {Object.keys(result.dimensions).reduce((acc, dim) => acc + result.dimensions[dim as Dimension].answered, 0)} 道题目的分析</p>
      </div>

      {/* Result card */}
      <div className="px-5 mt-4">
        <ResultCard
          mbtiType={result.type}
          description={description}
          dimensions={result.dimensions}
          revealed={phase === 'unlocked'}
        />
      </div>

      {/* Share-to-unlock section (shown when locked) */}
      {phase === 'locked' && (
        <div className="px-5 mt-6 animate-fade-in-up delay-300">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-purple-100/30 p-6 text-center">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">分享解锁完整结果</h3>
            <p className="text-sm text-gray-500 mb-5">
              分享给你的好友，即可查看完整的人格解读报告
            </p>

            {/* Share buttons */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {/* 微信 */}
              <button
                onClick={() => handleShare('wechat')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-green-50 border border-green-100 active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.32.32 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.136 0 .248-.111.248-.247 0-.06-.024-.12-.04-.178l-.326-1.233a.49.49 0 01.177-.556C23.018 17.842 24 16.104 24 14.126c0-3.074-2.903-5.272-7.062-5.268zM14.033 13.4c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">微信</span>
              </button>

              {/* 朋友圈 */}
              <button
                onClick={() => handleShare('moments')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-blue-50 border border-blue-100 active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">朋友圈</span>
              </button>

              {/* QQ */}
              <button
                onClick={() => handleShare('qq')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-cyan-50 border border-cyan-100 active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">QQ</span>
              </button>

              {/* 复制链接 */}
              <button
                onClick={() => handleShare('copy')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-purple-50 border border-purple-100 active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">复制</span>
              </button>
            </div>

            {/* Glowing CTA button */}
            <button
              onClick={() => handleShare('cta')}
              className="w-full py-4 rounded-2xl bg-btn-gradient text-white font-bold text-base shadow-lg shadow-purple-200/50 animate-pulse-glow active:scale-[0.97] transition-transform"
            >
              ✨ 分享解锁完整报告
            </button>
          </div>
        </div>
      )}

      {/* Sharing in progress indicator */}
      {phase === 'sharing' && (
        <div className="px-5 mt-6 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-purple-600 font-medium">正在解锁中...</span>
          </div>
        </div>
      )}

      {/* Share Poster (shown after unlock) */}
      {showPoster && phase === 'unlocked' && (
        <div className="px-5 mt-6">
          <div className="text-center mb-4">
            <h3 className="text-base font-bold text-gray-800">生成你的专属海报</h3>
            <p className="text-xs text-gray-400 mt-1">保存或分享你的 MBTI 结果卡片</p>
          </div>
          <SharePoster
            mbtiType={result.type}
            typeName={description.name}
            tag={description.tag}
            shareCode={shareCode}
          />
        </div>
      )}

      {/* Re-share buttons (after unlock) */}
      {phase === 'unlocked' && (
        <div className="px-5 mt-6 animate-fade-in-up">
          <div className="flex gap-3">
            <button
              onClick={() => handleShare('copy')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-purple-100/30 text-sm font-semibold text-gray-700 active:scale-[0.97] transition-transform"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              复制链接
            </button>
            <button
              onClick={() => {
                const url = `${window.location.origin}?ref=${shareCode}`;
                if (navigator.share) {
                  navigator.share({
                    title: `我的MBTI结果是${result.type}「${description.name}」`,
                    text: `我是${result.type}「${description.name}」——${description.tag}。快来测测你的人格类型吧！`,
                    url,
                  }).catch(() => {});
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-btn-gradient text-sm font-semibold text-white shadow-lg shadow-purple-200/50 active:scale-[0.97] transition-transform"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              更多分享
            </button>
          </div>
        </div>
      )}

      {/* Paid report CTA */}
      <div className="px-5 mt-8 animate-fade-in-up delay-400">
        <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/50 p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">📋</span>
            <h3 className="text-base font-bold text-gray-800">想更深入了解自己？</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            获取你的完整 MBTI 深度解读报告，包含职业建议、人际关系、成长路径等
          </p>
          <button
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-base shadow-lg shadow-orange-200/50 active:scale-[0.97] transition-transform"
            onClick={() => alert('功能开发中，敬请期待！')}
          >
            获取完整解读报告 ¥9.9
          </button>
          <p className="text-xs text-gray-400 mt-2">已有 12,846 人获取了深度报告</p>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />

      {/* Retake */}
      <div className="px-5 mt-2 mb-6 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-sm text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
        >
          重新测试
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">正在分析你的人格...</p>
          </div>
        </div>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}
