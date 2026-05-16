"use client";

import { useEffect, useState } from "react";

/* ================================================================
   Dimension data for the 4 MBTI spectrums
   ================================================================ */
const dimensions = [
  {
    left: "E",
    leftLabel: "外向",
    right: "I",
    rightLabel: "内向",
    icon: "💬",
    color: "from-purple-500 to-indigo-500",
    desc: "你从与人互动中获得能量，还是从独处中充电？",
  },
  {
    left: "S",
    leftLabel: "感觉",
    right: "N",
    rightLabel: "直觉",
    icon: "🔮",
    color: "from-pink-500 to-rose-500",
    desc: "你更关注具体的事实细节，还是抽象的可能性？",
  },
  {
    left: "T",
    leftLabel: "思考",
    right: "F",
    rightLabel: "情感",
    icon: "⚖️",
    color: "from-orange-500 to-amber-500",
    desc: "你做决定靠逻辑分析，还是靠内心感受？",
  },
  {
    left: "J",
    leftLabel: "判断",
    right: "P",
    rightLabel: "感知",
    icon: "🎯",
    color: "from-violet-500 to-purple-500",
    desc: "你喜欢计划有序的生活，还是随性自由的状态？",
  },
];

/* ================================================================
   Feature highlights data
   ================================================================ */
const features = [
  {
    icon: "✨",
    title: "免费测试",
    desc: "28道专业精选题目",
  },
  {
    icon: "🤖",
    title: "AI深度解读",
    desc: "个性化人格分析报告",
  },
  {
    icon: "🔓",
    title: "分享解锁更多",
    desc: "解锁隐藏人格洞察",
  },
];

/* ================================================================
   Homepage Component
   ================================================================ */
export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-hero-gradient animate-hero-gradient opacity-90" />

        {/* Decorative floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-12 left-6 w-16 h-16 rounded-full glass animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-32 right-8 w-10 h-10 rounded-full glass animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-24 left-1/4 w-20 h-20 rounded-2xl glass animate-float rotate-12"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-40 right-1/4 w-12 h-12 rounded-full glass animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-1/2 left-10 w-8 h-8 rounded-lg glass animate-float rotate-45"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="relative z-10 px-6 pt-16 pb-14 sm:pt-24 sm:pb-20 max-w-lg mx-auto text-center">
          {/* Logo / Brand */}
          <div
            className={`inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-white text-sm font-medium mb-8 ${
              mounted ? "animate-fade-in" : "opacity-0"
            }`}
          >
            <span className="text-base">🧠</span>
            <span>MBTI 人格探索</span>
          </div>

          {/* Main Title */}
          <h1
            className={`text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4 ${
              mounted ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            发现你的
            <br />
            <span className="text-yellow-200">MBTI 人格</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-white/85 text-base sm:text-lg font-medium mb-8 ${
              mounted ? "animate-fade-in-up delay-200" : "opacity-0"
            }`}
          >
            28道题，3分钟，遇见真实的自己 ✨
          </p>

          {/* CTA Button */}
          <button
            className={`bg-white text-purple-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-purple-900/30 hover:shadow-purple-900/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 animate-pulse-glow ${
              mounted ? "animate-fade-in-up delay-400" : "opacity-0"
            }`}
          >
            🚀 开始测试
          </button>

          {/* Social proof */}
          <div
            className={`mt-8 flex items-center justify-center gap-2 text-white/75 text-sm ${
              mounted ? "animate-fade-in delay-500" : "opacity-0"
            }`}
          >
            <span className="inline-flex -space-x-2">
              {["🧑‍💻", "👩‍🎨", "🧑‍🔬", "👩‍💼"].map((emoji, i) => (
                <span
                  key={i}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-sm border-2 border-white/30"
                >
                  {emoji}
                </span>
              ))}
            </span>
            <span>已有 </span>
            <span className="font-bold text-white counter-number">
              <Counter target={12847} />
            </span>
            <span> 人完成测试</span>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 80V40C360 0 720 80 1080 40C1260 20 1380 10 1440 5V80H0Z"
              className="fill-[#fdf4ff]"
            />
          </svg>
        </div>
      </section>

      {/* ========== FEATURE HIGHLIGHTS ========== */}
      <section className="px-6 py-10 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-3 gap-3">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`card p-4 text-center ${
                mounted ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${600 + i * 150}ms` }}
            >
              <div className="text-3xl mb-2">{feat.icon}</div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                {feat.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== DIMENSION PREVIEW CARDS ========== */}
      <section className="px-6 py-8 max-w-lg mx-auto w-full">
        <h2
          className={`text-xl font-bold text-center text-gray-800 mb-2 ${
            mounted ? "animate-fade-in-up delay-100" : "opacity-0"
          }`}
        >
          探索四个维度
        </h2>
        <p
          className={`text-center text-gray-500 text-sm mb-6 ${
            mounted ? "animate-fade-in delay-200" : "opacity-0"
          }`}
        >
          MBTI 人格由四个维度组合而成
        </p>

        <div className="space-y-3">
          {dimensions.map((dim, i) => (
            <div
              key={dim.left}
              className={`card-hover p-4 flex items-center gap-4 cursor-pointer ${
                mounted ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${300 + i * 120}ms` }}
            >
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${dim.color} flex items-center justify-center text-2xl shadow-md`}
              >
                {dim.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-extrabold text-gray-800">
                    {dim.left}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {dim.leftLabel}
                  </span>
                  <span className="text-gray-300 mx-1">⟷</span>
                  <span className="text-base font-extrabold text-gray-800">
                    {dim.right}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {dim.rightLabel}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed truncate">
                  {dim.desc}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-gray-300 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* ========== MOCK RESULT CARD ========== */}
      <section className="px-6 py-10 max-w-lg mx-auto w-full">
        <h2
          className={`text-xl font-bold text-center text-gray-800 mb-2 ${
            mounted ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          测试结果示例
        </h2>
        <p
          className={`text-center text-gray-500 text-sm mb-6 ${
            mounted ? "animate-fade-in delay-100" : "opacity-0"
          }`}
        >
          完成测试后你将获得一份精美的解读报告
        </p>

        <div
          className={`relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-200/50 ${
            mounted ? "animate-fade-in-up delay-300" : "opacity-0"
          }`}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-mock-result" />

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 p-6 text-white">
            {/* Type badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <span>🏆</span>
              <span>你的测试结果</span>
            </div>

            {/* MBTI Type */}
            <div className="text-center mb-4">
              <div className="text-5xl font-extrabold tracking-wider mb-1">
                INFP
              </div>
              <div className="text-lg font-semibold text-white/90">
                调停者 · 治愈系人格
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {["理想主义", "共情大师", "创意无限", "温柔坚定"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium"
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>

            {/* Dimension bars */}
            <div className="space-y-3 mb-5">
              {[
                { label: "外向 E", value: 30, rightLabel: "内向 I" },
                { label: "感觉 S", value: 25, rightLabel: "直觉 N" },
                { label: "思考 T", value: 35, rightLabel: "情感 F" },
                { label: "判断 J", value: 40, rightLabel: "感知 P" },
              ].map((bar) => (
                <div key={bar.label} className="flex items-center gap-2">
                  <span className="text-[10px] w-12 text-right text-white/70">
                    {bar.label.split(" ")[0]}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white/70"
                      style={{ width: `${bar.value}%` }}
                    />
                  </div>
                  <span className="text-[10px] w-12 text-white/70">
                    {bar.rightLabel.split(" ")[1]} {100 - bar.value}%
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-sm leading-relaxed text-white/90">
              你是一个温柔而坚定的理想主义者，内心拥有丰富的情感世界。
              你擅长理解他人的感受，总是追求真实与意义……
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA BOTTOM ========== */}
      <section className="px-6 py-12 max-w-lg mx-auto w-full text-center">
        <div
          className={`card p-8 ${
            mounted ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className="text-4xl mb-4">🌟</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            准备好发现真实的自己了吗？
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            只需3分钟，解锁属于你的人格密码
          </p>
          <button className="bg-btn-gradient text-white font-bold text-base px-12 py-3.5 rounded-2xl shadow-lg shadow-purple-300/40 hover:shadow-purple-400/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
            立即开始测试 →
          </button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="px-6 py-8 mt-auto">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-lg">🧠</span>
            <span className="font-bold text-gray-700">MBTI 人格探索</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            本测试基于 MBTI 理论模型，仅供娱乐与自我探索参考
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>关于我们</span>
            <span>·</span>
            <span>隐私政策</span>
            <span>·</span>
            <span>联系方式</span>
          </div>
          <p className="text-[10px] text-gray-300 mt-4">
            © 2026 MBTI 人格探索 · 用心做测试 🩷
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ================================================================
   Animated counter component
   ================================================================ */
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= target) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, count]);

  return <>{count.toLocaleString()}</>;
}
