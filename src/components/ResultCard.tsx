'use client';

import { TypeDescription } from '@/lib/type-descriptions';
import { MBTIResult, Dimension, DimensionScore } from '@/lib/mbti-calculator';

interface ResultCardProps {
  mbtiType: string;
  description: TypeDescription;
  dimensions: MBTIResult['dimensions'];
  revealed: boolean;
}

const DIMENSION_LABELS: Record<Dimension, { left: string; right: string; name: string }> = {
  EI: { left: 'E', right: 'I', name: '能量方向' },
  SN: { left: 'S', right: 'N', name: '信息获取' },
  TF: { left: 'T', right: 'F', name: '决策方式' },
  JP: { left: 'J', right: 'P', name: '生活态度' },
};

const DIMENSION_COLORS: Record<Dimension, { left: string; right: string; bar: string }> = {
  EI: { left: 'from-orange-400 to-amber-500', right: 'from-violet-500 to-purple-600', bar: 'from-orange-400 via-rose-400 to-violet-500' },
  SN: { left: 'from-emerald-400 to-teal-500', right: 'from-blue-500 to-indigo-600', bar: 'from-emerald-400 via-cyan-400 to-blue-500' },
  TF: { left: 'from-blue-400 to-cyan-500', right: 'from-pink-500 to-rose-500', bar: 'from-blue-400 via-violet-400 to-pink-500' },
  JP: { left: 'from-indigo-400 to-blue-500', right: 'from-amber-400 to-orange-500', bar: 'from-indigo-400 via-purple-400 to-amber-400' },
};

function DimensionBar({ dimension, score }: { dimension: Dimension; score: DimensionScore }) {
  const labels = DIMENSION_LABELS[dimension];
  const colors = DIMENSION_COLORS[dimension];
  const leftWins = score.left >= score.right;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-bold ${leftWins ? 'text-gray-800' : 'text-gray-500'}`}>
          {labels.left} {score.left}%
        </span>
        <span className="text-xs text-gray-400 font-medium">{labels.name}</span>
        <span className={`font-bold ${!leftWins ? 'text-gray-800' : 'text-gray-500'}`}>
          {score.right}% {labels.right}
        </span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-100/80">
        <div
          className={`bg-gradient-to-r ${colors.left} rounded-l-full transition-all duration-1000 ease-out`}
          style={{ width: `${score.left}%` }}
        />
        <div
          className={`bg-gradient-to-r ${colors.right} rounded-r-full transition-all duration-1000 ease-out`}
          style={{ width: `${score.right}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultCard({ mbtiType, description, dimensions, revealed }: ResultCardProps) {
  // Generate masked type like "I□□P"
  const maskedType = mbtiType
    .split('')
    .map((char, i) => {
      // Reveal first and last letter always, mask middle two
      if (i === 0 || i === 3) return char;
      return '□';
    })
    .join('');

  const displayType = revealed ? mbtiType : maskedType;
  const displayName = revealed ? description.name : '???';
  const displayTag = revealed ? description.tag : '分享后解锁你的完整人格解读 ✨';
  const displayOverview = revealed
    ? description.overview
    : description.overview.slice(0, 40) + '...';

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main type card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-[2px] animate-fade-in-up">
        <div className="relative rounded-[22px] bg-white overflow-hidden">
          {/* Header gradient area */}
          <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-purple-50 via-pink-50/50 to-orange-50/50">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200/20 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Type code */}
            <div className="relative text-center">
              <div
                className={`text-6xl sm:text-7xl font-extrabold tracking-wider transition-all duration-700 ${
                  revealed
                    ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent'
                    : 'text-gray-700'
                }`}
              >
                {displayType}
              </div>

              {/* Chinese name */}
              <div
                className={`mt-2 text-2xl font-bold transition-all duration-700 ${
                  revealed ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                「{displayName}」
              </div>

              {/* Tag line */}
              <div
                className={`mt-3 text-base font-medium px-4 py-1.5 rounded-full inline-block transition-all duration-700 ${
                  revealed
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {displayTag}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="px-6 py-5">
            <p
              className={`text-sm leading-relaxed transition-all duration-700 ${
                revealed ? 'text-gray-600' : 'text-gray-300 select-none'
              }`}
              style={!revealed ? { filter: 'blur(4px)' } : {}}
            >
              {displayOverview}
            </p>
          </div>

          {/* Dimension bars */}
          <div className="px-6 pb-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
              维度分析
            </h3>
            {(['EI', 'SN', 'TF', 'JP'] as Dimension[]).map((dim) => (
              <DimensionBar key={dim} dimension={dim} score={dimensions[dim]} />
            ))}
          </div>
        </div>
      </div>

      {/* Strengths section */}
      <div className={`mt-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-purple-100/30 p-5 animate-fade-in-up delay-200 transition-all duration-700 ${!revealed ? 'opacity-50' : ''}`}>
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
          {revealed ? '你的核心优势' : '分享后解锁优势分析'}
        </h3>
        <div className="space-y-2.5">
          {description.strengths.map((strength, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5"
              style={!revealed ? { filter: 'blur(4px)' } : {}}
            >
              <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className={`text-sm leading-relaxed ${revealed ? 'text-gray-600' : 'text-gray-300 select-none'}`}>
                {strength}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
