"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Question, Option } from "@/engines/core/types";
import type { ReflectionFocus } from "@/store/testStore";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (option: Option) => void;
  selectedOption?: string;
  focus?: ReflectionFocus;
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
}: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-2xl mx-auto px-4 py-8"
    >
      <div className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
        问题 {questionNumber} / {totalQuestions}
      </div>
      {focus && (
        <div className="mb-4 inline-flex rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-400">
          {focusLabels[focus]}
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {question.options.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => onAnswer(option)}
              className={`
                w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200
                min-h-[64px] flex items-center gap-3
                ${
                  selectedOption === option.value
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500 dark:hover:bg-zinc-750"
                }
              `}
            >
              <span
                className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  selectedOption === option.value
                    ? "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                }
              `}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-base md:text-lg leading-relaxed">{option.label}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
