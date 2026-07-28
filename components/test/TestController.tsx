"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { Question, Option } from "@/engines/core/types";
import { getTest } from "@/tests/_registry";
import { ReflectionFocus, useTestStore } from "@/store/testStore";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";

const QUESTION_TRANSITION_MS = 320;

interface TestControllerProps {
  slug: string;
}

export function TestController({ slug }: TestControllerProps) {
  const router = useRouter();
  const test = useMemo(() => getTest(slug), [slug]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isLockedRef = useRef(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  const lockTransition = useCallback(() => {
    clearTransitionTimer();
    isLockedRef.current = true;
    setIsTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      isLockedRef.current = false;
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, QUESTION_TRANSITION_MS);
  }, [clearTransitionTimer]);

  useEffect(() => {
    return () => clearTransitionTimer();
  }, [clearTransitionTimer]);

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
      if (isLockedRef.current || isTransitioning) return;

      const currentQ = questions[currentQuestionIndex];
      if (!currentQ) return;

      lockTransition();

      setAnswer(slug, {
        questionId: currentQ.id,
        selectedOption: option,
      });

      if (currentQuestionIndex >= questions.length - 1) {
        complete(slug);
        router.push(`/result/${slug}`);
      }
    },
    [
      isTransitioning,
      questions,
      currentQuestionIndex,
      lockTransition,
      setAnswer,
      complete,
      slug,
      router,
    ]
  );

  const handleBack = useCallback(() => {
    if (isLockedRef.current || isTransitioning) return;
    clearTransitionTimer();
    isLockedRef.current = false;
    setIsTransitioning(false);
    goBack(slug);
  }, [isTransitioning, clearTransitionTimer, goBack, slug]);

  const handleReset = useCallback(() => {
    clearTransitionTimer();
    isLockedRef.current = false;
    setIsTransitioning(false);
    reset(slug);
  }, [clearTransitionTimer, reset, slug]);

  if (!test) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className={ui.bodySm}>测试未找到</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className={cn(ui.spinner, "mx-auto mb-5")} />
          <p className={ui.caption}>正在加载题目...</p>
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
      <div className="flex flex-1 items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-pill border border-accent/30 bg-accent-soft">
            <Check size={28} className="text-accent" strokeWidth={1.5} />
          </div>
          <h2 className={cn(ui.h2, "mb-3")}>测试完成</h2>
          <p className={cn(ui.bodySm, "mb-8")}>正在计算你的结果...</p>
          <button
            onClick={() => router.push(`/result/${slug}`)}
            className={ui.btnPrimary}
          >
            查看结果
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <ProgressBar
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
                selectedOption={currentAnswer?.selectedOption.value}
                focus={focus}
                disabled={isTransitioning}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={cn(ui.container, "flex items-center justify-between py-6")}>
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex <= 0 || isTransitioning}
          className={ui.btnGhost}
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          上一题
        </button>

        <button
          onClick={handleReset}
          disabled={isTransitioning}
          className={ui.btnGhost}
        >
          <RotateCcw size={18} strokeWidth={1.5} />
          重新开始
        </button>
      </div>
    </div>
  );
}
