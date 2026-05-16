'use client';

interface SharePosterProps {
  mbtiType: string;
  typeName: string;
  tag: string;
  shareCode: string;
}

export default function SharePoster({ mbtiType, typeName, tag, shareCode }: SharePosterProps) {
  const handleSave = () => {
    // In a real app, this would use html2canvas or similar
    // For now, show a toast-style prompt
    alert('长按海报图片即可保存到手机相册 📱');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `我的MBTI结果是${mbtiType}「${typeName}」`,
        text: `我是${mbtiType}「${typeName}」——${tag}。快来测测你的人格类型吧！`,
        url: `${window.location.origin}?ref=${shareCode}`,
      }).catch(() => {});
    } else {
      // Fallback: copy link
      const url = `${window.location.origin}?ref=${shareCode}`;
      navigator.clipboard.writeText(url).then(() => {
        alert('链接已复制，快去分享给好友吧！ 🔗');
      }).catch(() => {
        alert('请手动复制链接分享给好友');
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
      {/* Poster Card */}
      <div
        id="share-poster"
        className="relative overflow-hidden rounded-3xl p-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 30%, #ec4899 60%, #f97316 85%, #fbbf24 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute top-1/4 right-0 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
          {/* Small sparkle decorations */}
          <div className="absolute top-6 right-8 text-white/30 text-2xl">✦</div>
          <div className="absolute top-16 left-6 text-white/20 text-lg">✧</div>
          <div className="absolute bottom-24 right-12 text-white/25 text-xl">✦</div>
          <div className="absolute bottom-40 left-10 text-white/15 text-sm">✧</div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo / Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
              <span>🧠</span>
              <span>MBTI 人格测试</span>
            </div>
          </div>

          {/* Type Display */}
          <div className="text-center mb-4">
            <div className="text-7xl sm:text-8xl font-extrabold tracking-widest drop-shadow-lg">
              {mbtiType}
            </div>
          </div>

          {/* Chinese name */}
          <div className="text-center mb-2">
            <span className="text-2xl sm:text-3xl font-bold">
              「{typeName}」
            </span>
          </div>

          {/* Tag line */}
          <div className="text-center mb-8">
            <span className="text-base sm:text-lg font-medium text-white/90">
              {tag}
            </span>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-xs text-white/50">MY PERSONALITY TYPE</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Bottom section: QR placeholder + CTA */}
          <div className="flex items-center justify-between">
            {/* Left: share text */}
            <div className="flex-1 pr-4">
              <p className="text-sm text-white/80 leading-relaxed">
                我在 MBTI 人格测试中的结果是
                <span className="font-bold text-white">「{typeName}」</span>
                ，快来测测你的人格类型吧！
              </p>
            </div>

            {/* Right: QR code placeholder */}
            <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-1 shadow-lg">
              <div className="grid grid-cols-3 gap-[2px]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-[1px] ${
                      [0, 1, 3, 4, 5, 7, 8].includes(i) ? 'bg-gray-800' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[7px] font-medium text-gray-600 mt-0.5">扫码测一测</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-purple-100/30 text-sm font-semibold text-gray-700 active:scale-[0.97] transition-transform"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          保存海报
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-btn-gradient text-sm font-semibold text-white shadow-lg shadow-purple-200/50 active:scale-[0.97] transition-transform"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          分享给好友
        </button>
      </div>
    </div>
  );
}
