'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { pickRandomQuestions, Question, TOTAL_QUESTIONS } from '@/lib/question-bank-free';
import { Answer } from '@/lib/mbti-calculator';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';

type Phase = 'intro' | 'quiz' | 'submitting';

export default function TestPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [slideDirection, setSlideDirection] = useState<'enter' | 'exit'>('enter');
  const [questionKey, setQuestionKey] = useState(0);

  // Generate random question set once (memoized)
  const questions = useMemo(() => pickRandomQuestions(), []);
  const totalQuestions = questions.length;

  const submittingRef = useRef(false);

  const submitAndNavigate = useCallback(async (finalAnswers: Answer[]) => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    const referrerCode = new URLSearchParams(window.location.search).get('ref');

    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: finalAnswers,
          referrerCode: referrerCode || undefined,
          questionIds: questions.map(q => q.id), // send which questions were used
        }),
      });
      const data = await res.json();
      if (data.sessionId) {
        window.location.href = `/result?s=${data.sessionId}`;
      } else {
        window.location.href = '/result';
      }
    } catch {
      window.location.href = '/result';
    }
  }, [questions]);

  const startQuiz = useCallback(() => {
    setPhase('quiz');
  }, []);

  const handleAnswer = useCallback(
    (choice: 1 | 2 | 3 | 4 | 5) => {
      const question = questions[currentIndex];
      const answer: Answer = { questionId: question.id, choice };

      const newAnswers = [...answers];
      newAnswers[currentIndex] = answer;
      setAnswers(newAnswers);

      setSlideDirection('exit');

      setTimeout(() => {
        if (currentIndex + 1 >= totalQuestions) {
          setPhase('submitting');
          submitAndNavigate(newAnswers);
        } else {
          setCurrentIndex((i) => i + 1);
          setQuestionKey((k) => k + 1);
          setSlideDirection('enter');
        }
      }, 250);
    },
    [currentIndex, totalQuestions, answers, questions, submitAndNavigate],
  );

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setSlideDirection('exit');
      setTimeout(() => {
        setCurrentIndex((i) => i - 1);
        setQuestionKey((k) => k + 1);
        setSlideDirection('enter');
      }, 200);
    }
  }, [currentIndex]);

  // ==================== INTRO ====================
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center max-w-sm animate-fade-in-up">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-xl shadow-purple-200/50">
            <span className="text-4xl">🧠</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">
            准备好了吗？
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-2">
            共 {totalQuestions} 道精选情境题
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mb-8">
            没有对错之分，凭第一直觉选择即可 ✨
          </p>

          <div className="space-y-2.5 mb-8 text-left">
            {[
              { icon: '⚡', text: '大约需要 3~5 分钟' },
              { icon: '🎯', text: '每题5个选项，选择你的倾向程度' },
              { icon: '🔄', text: '可以随时返回上一题' },
              { icon: '🎲', text: '每次测试题目不同，更准确' },
            ].map((tip) => (
              <div
                key={tip.icon}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/70 border border-purple-100/60"
              >
                <span className="text-lg">{tip.icon}</span>
                <span className="text-sm text-gray-600">{tip.text}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={startQuiz}
            className="w-full py-4 rounded-2xl bg-btn-gradient text-white font-bold text-lg shadow-xl shadow-purple-300/40 hover:shadow-2xl hover:shadow-purple-300/50 active:scale-[0.97] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            开始测试 →
          </button>
        </div>
      </div>
    );
  }

  // ==================== SUBMITTING ====================
  if (phase === 'submitting') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">正在分析你的人格...</p>
          <p className="text-gray-400 text-sm mt-1">请稍候</p>
        </div>
      </div>
    );
  }

  // ==================== QUIZ ====================
  const currentQuestion: Question = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-subtle-warm/80 backdrop-blur-md pt-3 pb-1">
        <ProgressBar current={currentIndex} total={totalQuestions} />

        {currentIndex > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="mt-2 ml-5 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            上一题
          </button>
        )}
      </div>

      <div className="flex-1 flex items-start justify-center pt-6 sm:pt-10 pb-12">
        <div
          key={questionKey}
          className={`
            w-full transition-all duration-200 ease-out
            ${slideDirection === 'enter'
              ? 'animate-slide-in-right'
              : 'opacity-0 translate-x-[-24px]'
            }
          `}
        >
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
          />
        </div>
      </div>
    </div>
  );
}
