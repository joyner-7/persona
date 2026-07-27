"use client";

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function ProgressBar({
  currentQuestion,
  totalQuestions,
}: ProgressBarProps) {
  const boundedCurrent =
    totalQuestions > 0
      ? Math.min(Math.max(currentQuestion, 1), totalQuestions)
      : 0;
  const percentage =
    totalQuestions > 0
      ? Math.round((boundedCurrent / totalQuestions) * 100)
      : 0;

  return (
    <div className="w-full px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            第 {boundedCurrent} / {totalQuestions} 题
          </span>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {percentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
