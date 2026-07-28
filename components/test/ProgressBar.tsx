"use client";

import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";

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
    <div className={cn(ui.container, "py-6")}>
      <div className="flex items-center justify-between mb-3">
        <span className={ui.caption}>
          第 {boundedCurrent} / {totalQuestions} 题
        </span>
        <span className="text-sm tabular-nums text-text-sub">{percentage}%</span>
      </div>
      <div className="h-px w-full overflow-hidden rounded-pill bg-divider">
        <div
          className="h-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
