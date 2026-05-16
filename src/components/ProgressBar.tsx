'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full px-5 py-2">
      {/* Counter */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-purple-600/70">
          {current === 0 ? '开始' : '进行中'}
        </span>
        <span className="text-xs font-semibold text-gray-500 tabular-nums">
          {current}/{total}
        </span>
      </div>

      {/* Track */}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ '--progress': `${percentage}%`, width: `${percentage}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
