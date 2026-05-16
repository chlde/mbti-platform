'use client';

import { useState, useCallback } from 'react';
import { Question } from '@/lib/question-bank-free';

interface QuestionCardProps {
  question: Question;
  onAnswer: (choice: 'A' | 'B') => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);

  const handleSelect = useCallback(
    (choice: 'A' | 'B') => {
      if (selected) return; // prevent double-tap
      setSelected(choice);
      setTimeout(() => {
        onAnswer(choice);
      }, 300);
    },
    [selected, onAnswer],
  );

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

      {/* Options */}
      <div className="space-y-3">
        {/* Option A */}
        <button
          type="button"
          onClick={() => handleSelect('A')}
          disabled={!!selected}
          className={`
            group relative w-full text-left rounded-2xl border-2 p-4 sm:p-5
            transition-all duration-200 ease-out
            focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
            ${
              selected === 'A'
                ? 'border-purple-400 bg-purple-50 scale-[1.02] shadow-lg shadow-purple-200/50'
                : selected === 'B'
                ? 'border-gray-200 bg-gray-50/50 opacity-50 scale-[0.98]'
                : 'border-purple-200/60 bg-white/80 hover:border-purple-300 hover:bg-purple-50/40 hover:shadow-md active:scale-[0.98]'
            }
          `}
        >
          {/* Gradient accent bar */}
          <div
            className={`
            absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-colors duration-200
            ${selected === 'A' ? 'bg-gradient-to-b from-purple-500 to-pink-500' : 'bg-purple-200 group-hover:bg-purple-300'}
          `}
          />

          <div className="flex items-start gap-3 pl-3">
            {/* Letter badge */}
            <span
              className={`
              flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
              transition-colors duration-200
              ${
                selected === 'A'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                  : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
              }
            `}
            >
              A
            </span>
            <p
              className={`
              text-sm sm:text-base leading-relaxed pt-0.5 transition-colors duration-200
              ${selected === 'A' ? 'text-purple-900 font-medium' : 'text-gray-700'}
            `}
            >
              {question.optionA}
            </p>
          </div>
        </button>

        {/* Option B */}
        <button
          type="button"
          onClick={() => handleSelect('B')}
          disabled={!!selected}
          className={`
            group relative w-full text-left rounded-2xl border-2 p-4 sm:p-5
            transition-all duration-200 ease-out
            focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
            ${
              selected === 'B'
                ? 'border-pink-400 bg-pink-50 scale-[1.02] shadow-lg shadow-pink-200/50'
                : selected === 'A'
                ? 'border-gray-200 bg-gray-50/50 opacity-50 scale-[0.98]'
                : 'border-pink-200/60 bg-white/80 hover:border-pink-300 hover:bg-pink-50/40 hover:shadow-md active:scale-[0.98]'
            }
          `}
        >
          {/* Gradient accent bar */}
          <div
            className={`
            absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-colors duration-200
            ${selected === 'B' ? 'bg-gradient-to-b from-pink-500 to-orange-400' : 'bg-pink-200 group-hover:bg-pink-300'}
          `}
          />

          <div className="flex items-start gap-3 pl-3">
            {/* Letter badge */}
            <span
              className={`
              flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
              transition-colors duration-200
              ${
                selected === 'B'
                  ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white'
                  : 'bg-pink-100 text-pink-600 group-hover:bg-pink-200'
              }
            `}
            >
              B
            </span>
            <p
              className={`
              text-sm sm:text-base leading-relaxed pt-0.5 transition-colors duration-200
              ${selected === 'B' ? 'text-pink-900 font-medium' : 'text-gray-700'}
            `}
            >
              {question.optionB}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
