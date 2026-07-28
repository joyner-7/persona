"use client";

import { Question, Option } from "@/engines/core/types";
import type { ReflectionFocus } from "@/store/testStore";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (option: Option) => void;
  selectedOption?: string;
  focus?: ReflectionFocus;
  /** 切题过渡中禁用选项，防止误触下一题 */
  disabled?: boolean;
}

const focusLabels: Record<ReflectionFocus, string> = {
  parents: "这次重点：理解你和父母之间的旧互动",
  relationships: "这次重点：理解你的亲密关系脚本",
  self_worth: "这次重点：理解你的价值感从哪里来",
  boundaries: "这次重点：理解边界、控制和过度负责",
  emotion: "这次重点：理解情绪表达与求助方式",
};

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedOption,
  focus,
  disabled = false,
}: QuestionCardProps) {
  return (
    <div className={cn(ui.container, "py-10 md:py-14")}>
      <p className={cn(ui.caption, "mb-3")}>
        问题 {questionNumber} / {totalQuestions}
      </p>

      {focus && (
        <div className="mb-8">
          <span className={ui.tag}>{focusLabels[focus]}</span>
        </div>
      )}

      <h2 className={cn(ui.h2, "mb-10 md:mb-12")}>{question.text}</h2>

      <div
        className={cn(
          "space-y-4",
          disabled && "pointer-events-none opacity-60"
        )}
        aria-disabled={disabled}
      >
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onAnswer(option)}
              className={cn(ui.option, isSelected && ui.optionSelected)}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-pill text-sm",
                  isSelected
                    ? "border border-accent/40 bg-card text-accent"
                    : "border border-border-card bg-accent-soft/60 text-text-sub"
                )}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
