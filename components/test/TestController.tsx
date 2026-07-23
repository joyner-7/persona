"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Question, Option } from "@/engines/core/types";
import { getTest } from "@/tests/_registry";
import { ReflectionFocus, useTestStore } from "@/store/testStore";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";

interface TestControllerProps {
  slug: string;
}

export function TestController({ slug }: TestControllerProps) {
  const router = useRouter();
  const test = useMemo(() => getTest(slug), [slug]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const session = useTestStore((s) => s.sessions[slug]);
  const setFocus = useTestStore((s) => s.setFocus);
  const setAnswer = useTestStore((s) => s.setAnswer);
  const goBack = useTestStore((s) => s.goBack);
  const complete = useTestStore((s) => s.complete);
  const reset = useTestStore((s) => s.reset);

  const currentQuestionIndex = session?.currentQuestionIndex ?? 0;
  const answers = session?.answers ?? [];
  const isCompleted = session?.isCompleted ?? false;
  const focus = session?.focus;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focusParam = params.get("focus") as ReflectionFocus | null;
    const validFocuses: ReflectionFocus[] = [
      "parents",
      "relationships",
      "self_worth",
      "boundaries",
      "emotion",
    ];
    if (focusParam && validFocuses.includes(focusParam)) {
      setFocus(slug, focusParam);
    }
  }, [setFocus, slug]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!test) return;
      const qs = await Promise.resolve(test.getQuestions());
      if (!cancelled) {
        setQuestions(qs);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [test]);

  const handleAnswer = useCallback(
    (option: Option) => {
      const currentQ = questions[currentQuestionIndex];
      if (!currentQ) return;

      setAnswer(slug, {
        questionId: currentQ.id,
        selectedOption: option,
      });

      if (currentQuestionIndex >= questions.length - 1) {
        complete(slug);
        router.push(`/result/${slug}`);
      }
    },
    [questions, currentQuestionIndex, setAnswer, complete, slug, router]
  );

  const handleBack = useCallback(() => {
    goBack(slug);
  }, [goBack, slug]);

  const handleReset = useCallback(() => {
    reset(slug);
  }, [reset, slug]);

  if (!test) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500">测试未找到</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"
          />
          <p className="text-zinc-500">正在加载题目...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  if (isCompleted) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-zinc-900 dark:bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              className="w-8 h-8 text-white dark:text-zinc-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">测试完成</h2>
          <p className="text-zinc-500 mb-6">正在计算你的结果...</p>
          <button
            onClick={() => router.push(`/result/${slug}`)}
            className="px-6 py-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full font-medium"
          >
            查看结果
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ProgressBar
        current={currentQuestionIndex}
        total={questions.length}
      />

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              selectedOption={currentAnswer?.selectedOption.value}
              focus={focus}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 py-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex <= 0}
          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={16} />
          上一题
        </button>

        {currentAnswer && currentQuestionIndex < questions.length - 1 && (
          <button
            onClick={() => {
              setAnswer(slug, {
                questionId: currentQuestion.id,
                selectedOption: currentAnswer.selectedOption,
              });
            }}
            className="flex items-center gap-2 px-6 py-2 text-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full hover:opacity-90 transition-opacity"
          >
            下一题
            <ArrowLeft size={16} className="rotate-180" />
          </button>
        )}

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <RotateCcw size={16} />
          重新开始
        </button>
      </div>
    </div>
  );
}
