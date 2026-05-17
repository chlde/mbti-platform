'use client';

import { useState, useCallback } from 'react';
import { Question } from '@/lib/question-bank-free';

interface QuestionCardProps {
  question: Question;
  onAnswer: (choice: 1 | 2 | 3 | 4 | 5) => void;
  questionNumber: number;
  totalQuestions: number;
}

const OPTION_LABELS = [
  { value: 1, label: '完全选这', emoji: '💪' },
  { value: 2, label: '比较选这', emoji: '👍' },
  { value: 3, label: '都差不多', emoji: '🤷' },
  { value: 4, label: '比较选这', emoji: '👍' },
  { value: 5, label: '完全选这', emoji: '💪' },
] as const;

export default function QuestionCard({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const handleSelect = useCallback(
    (choice: 1 | 2 | 3 | 4 | 5) => {
      if (selected) return;
      setSelected(choice);
      setTimeout(() => {
        onAnswer(choice);
      }, 400);
    },
    [selected, onAnswer],
  );

  // Highlight intensity for the gradient bar at bottom
  const getBarWidth = (optValue: number) => {
    if (!selected) return '0%';
    if (selected === optValue) return '100%';
    return '0%';
  };

  return (
    <div className="w-full max-w-lg mx-auto px-5">
      {/* Question number badge */}
      <div className="flex items-center justify-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs font-semibold text-purple-600 tabular-nums">
            第 {questionNumber} 题 / 共 {totalQuestions} 题
          </span>
        </span>
      </div>

      {/* Question text */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center leading-relaxed mb-8 animate-fade-in-up">
        {question.text}
      </h2>

      {/* Two poles display */}
      <div className="flex justify-between items-center mb-5 px-2">
        <div className={`flex-1 text-center transition-all duration-300 ${
          selected && selected <= 2 ? 'scale-105 opacity-100' : selected ? 'opacity-40' : ''
        }`}>
          <span className="text-sm font-bold text-purple-600 block">A</span>
          <span className="text-xs sm:text-sm text-gray-600 leading-snug block mt-1">{question.poleA}</span>
        </div>
        <div className="mx-3 text-gray-300 text-lg select-none">⟷</div>
        <div className={`flex-1 text-center transition-all duration-300 ${
          selected && selected >= 4 ? 'scale-105 opacity-100' : selected ? 'opacity-40' : ''
        }`}>
          <span className="text-sm font-bold text-pink-600 block">B</span>
          <span className="text-xs sm:text-sm text-gray-600 leading-snug block mt-1">{question.poleB}</span>
        </div>
      </div>

      {/* 5-option scale */}
      <div className="mt-6">
        <div className="flex gap-2">
          {OPTION_LABELS.map((opt) => {
            const isSelected = selected === opt.value;
            const isHovered = hovered === opt.value && !selected;
            const isLeftSide = opt.value <= 2;
            const isRightSide = opt.value >= 4;
            const isMiddle = opt.value === 3;

            let bgColor = 'bg-white';
            let borderColor = 'border-gray-200';
            let textColor = 'text-gray-600';
            let scale = '';

            if (isSelected) {
              if (isLeftSide) {
                bgColor = 'bg-purple-50';
                borderColor = 'border-purple-400';
                textColor = 'text-purple-700';
              } else if (isRightSide) {
                bgColor = 'bg-pink-50';
                borderColor = 'border-pink-400';
                textColor = 'text-pink-700';
              } else {
                bgColor = 'bg-gray-50';
                borderColor = 'border-gray-400';
                textColor = 'text-gray-700';
              }
              scale = 'scale-105 shadow-lg';
            } else if (selected) {
              bgColor = 'bg-gray-50';
              borderColor = 'border-gray-100';
              textColor = 'text-gray-300';
              scale = 'scale-95 opacity-50';
            } else if (isHovered) {
              if (isLeftSide) {
                bgColor = 'bg-purple-50/50';
                borderColor = 'border-purple-300';
                textColor = 'text-purple-600';
              } else if (isRightSide) {
                bgColor = 'bg-pink-50/50';
                borderColor = 'border-pink-300';
                textColor = 'text-pink-600';
              } else {
                bgColor = 'bg-gray-50';
                borderColor = 'border-gray-300';
                textColor = 'text-gray-600';
              }
              scale = 'scale-105';
            }

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value as 1 | 2 | 3 | 4 | 5)}
                onMouseEnter={() => setHovered(opt.value)}
                onMouseLeave={() => setHovered(null)}
                disabled={!!selected}
                className={`
                  flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2
                  transition-all duration-200 ease-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
                  active:scale-95
                  ${bgColor} ${borderColor} ${textColor} ${scale}
                `}
              >
                <span className="text-lg leading-none">{opt.emoji}</span>
                <span className="text-[10px] sm:text-xs font-semibold leading-tight text-center whitespace-nowrap">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scale labels below */}
        <div className="flex justify-between mt-2 px-3">
          <span className="text-[10px] text-gray-400">← 倾向 A</span>
          <span className="text-[10px] text-gray-400">中立</span>
          <span className="text-[10px] text-gray-400">倾向 B →</span>
        </div>
      </div>
    </div>
  );
}
