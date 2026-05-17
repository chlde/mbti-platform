'use client';

import { TypeDescription } from '@/lib/type-descriptions';
import { MBTIResult, Dimension, DimensionScore } from '@/lib/mbti-calculator';
import CharacterImage from '@/components/CharacterImage';

interface ResultCardProps {
  mbtiType: string;
  description: TypeDescription;
  dimensions: MBTIResult['dimensions'];
  revealed: boolean;
}

const DIMENSION_LABELS: Record<Dimension, { left: string; right: string; name: string; emoji: string }> = {
  EI: { left: 'E', right: 'I', name: '能量方向', emoji: '⚡' },
  SN: { left: 'S', right: 'N', name: '信息获取', emoji: '👁️' },
  TF: { left: 'T', right: 'F', name: '决策方式', emoji: '⚖️' },
  JP: { left: 'J', right: 'P', name: '生活态度', emoji: '🎯' },
};

const DIMENSION_COLORS: Record<Dimension, { left: string; right: string; bar: string }> = {
  EI: { left: 'from-orange-400 to-amber-500', right: 'from-violet-500 to-purple-600', bar: 'from-orange-400 via-rose-400 to-violet-500' },
  SN: { left: 'from-emerald-400 to-teal-500', right: 'from-blue-500 to-indigo-600', bar: 'from-emerald-400 via-cyan-400 to-blue-500' },
  TF: { left: 'from-blue-400 to-cyan-500', right: 'from-pink-500 to-rose-500', bar: 'from-blue-400 via-violet-400 to-pink-500' },
  JP: { left: 'from-indigo-400 to-blue-500', right: 'from-amber-400 to-orange-500', bar: 'from-indigo-400 via-purple-400 to-amber-400' },
};

function DimensionBar({ dimension, score, revealed }: { dimension: Dimension; score: DimensionScore; revealed: boolean }) {
  const labels = DIMENSION_LABELS[dimension];
  const colors = DIMENSION_COLORS[dimension];
  const leftWins = score.left >= score.right;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-bold transition-all duration-500 ${leftWins ? 'text-gray-800 scale-105' : 'text-gray-400'}`}>
          {labels.left} {revealed ? `${score.left}%` : '?'}
        </span>
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
          <span>{labels.emoji}</span>
          {labels.name}
        </span>
        <span className={`font-bold transition-all duration-500 ${!leftWins ? 'text-gray-800 scale-105' : 'text-gray-400'}`}>
          {revealed ? `${score.right}%` : '?'} {labels.right}
        </span>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100/80">
        <div
          className={`bg-gradient-to-r ${colors.left} rounded-l-full transition-all duration-1000 ease-out`}
          style={{ width: `${revealed ? score.left : 50}%` }}
        />
        <div
          className={`bg-gradient-to-r ${colors.right} rounded-r-full transition-all duration-1000 ease-out`}
          style={{ width: `${revealed ? score.right : 50}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultCard({ mbtiType, description, dimensions, revealed }: ResultCardProps) {
  const maskedType = mbtiType
    .split('')
    .map((char, i) => (i === 0 || i === 3 ? char : '□'))
    .join('');

  const displayType = revealed ? mbtiType : maskedType;
  const displayName = revealed ? description.name : '???';
  const displayTag = revealed ? description.tag : '分享后解锁你的完整人格解读 ✨';
  const displayOverview = revealed
    ? description.overview
    : description.overview.slice(0, 40) + '...';

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* 主卡片 */}
      <div className={`relative overflow-hidden rounded-3xl transition-all duration-700 ${
        revealed 
          ? 'shadow-2xl' 
          : 'shadow-lg'
      }`}>
        {/* 顶部渐变背景 */}
        <div className={`relative px-6 pt-10 pb-8 transition-all duration-700 ${
          revealed 
            ? 'bg-gradient-to-br from-purple-50 via-pink-50/50 to-orange-50/50' 
            : 'bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/50'
        }`}>
          {/* 装饰圆 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200/15 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200/15 rounded-full translate-y-1/3 -translate-x-1/4" />
          
          {/* 闪光粒子（解锁后） */}
          {revealed && (
            <>
              <div className="absolute top-8 left-8 text-yellow-300/60 text-sm animate-fade-in delay-100">✦</div>
              <div className="absolute top-16 right-12 text-pink-300/50 text-lg animate-fade-in delay-200">✧</div>
              <div className="absolute bottom-12 left-12 text-purple-300/40 text-xs animate-fade-in delay-300">✦</div>
              <div className="absolute bottom-20 right-8 text-orange-300/50 text-sm animate-fade-in delay-400">✧</div>
            </>
          )}

          {/* 角色形象 */}
          <div className="relative flex justify-center mb-5">
            <CharacterImage mbtiType={mbtiType} revealed={revealed} size={160} />
          </div>

          {/* 类型代码 */}
          <div className="relative text-center">
            <div
              className={`text-6xl sm:text-7xl font-black tracking-wider transition-all duration-700 ${
                revealed
                  ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent'
                  : 'text-gray-600'
              }`}
            >
              {displayType}
            </div>

            {/* 中文名 */}
            <div
              className={`mt-2 text-2xl font-bold transition-all duration-700 ${
                revealed ? 'text-gray-800' : 'text-gray-400'
              }`}
            >
              「{displayName}」
            </div>

            {/* 标签 */}
            <div
              className={`mt-3 text-base font-medium px-5 py-2 rounded-full inline-block transition-all duration-700 ${
                revealed
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {displayTag}
            </div>
          </div>
        </div>

        {/* 概述 */}
        <div className={`px-6 py-5 transition-all duration-500 ${
          revealed ? 'bg-white' : 'bg-gray-50/50'
        }`}>
          <p
            className={`text-sm leading-relaxed transition-all duration-700 ${
              revealed ? 'text-gray-600' : 'text-gray-300 select-none'
            }`}
            style={!revealed ? { filter: 'blur(4px)' } : {}}
          >
            {displayOverview}
          </p>
        </div>

        {/* 维度分析 */}
        <div className={`px-6 pb-6 space-y-4 transition-all duration-500 ${
          revealed ? 'bg-white' : 'bg-gray-50/50'
        }`}>
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
            维度分析
          </h3>
          {(['EI', 'SN', 'TF', 'JP'] as Dimension[]).map((dim, i) => (
            <div key={dim} className="animate-fade-in-up" style={{ animationDelay: `${200 + i * 100}ms` }}>
              <DimensionBar dimension={dim} score={dimensions[dim]} revealed={revealed} />
            </div>
          ))}
        </div>
      </div>

      {/* 核心优势 */}
      <div
        className={`mt-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-purple-100/30 p-5 animate-fade-in-up transition-all duration-700 ${
          !revealed ? 'opacity-50' : ''
        }`}
      >
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
          {revealed ? '✨ 你的核心优势' : '分享后解锁优势分析'}
        </h3>
        <div className="space-y-2.5">
          {description.strengths.map((strength, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 animate-fade-in-up"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className={`text-sm leading-relaxed transition-all duration-700 ${
                revealed ? 'text-gray-600' : 'text-gray-300 select-none'
              }`}>
                {strength}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 盲区 */}
      {revealed && (
        <div className="mt-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-purple-100/30 p-5 animate-fade-in-up">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
            ⚠️ 需要注意的盲区
          </h3>
          <div className="space-y-2.5">
            {description.blindSpots.map((spot, i) => (
              <div key={i} className="flex items-start gap-2.5 animate-fade-in-up" style={{ animationDelay: `${600 + i * 100}ms` }}>
                <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                  </svg>
                </span>
                <span className="text-sm leading-relaxed text-gray-600">{spot}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
