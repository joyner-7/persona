import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { ResultShell } from "@/components/result/ResultShell";
import { HomeCover } from "@/components/home/HomeCover";
import { ProgressBar } from "@/components/test/ProgressBar";
import { QuestionCard } from "@/components/test/QuestionCard";
import type { Answer, Option, ScoreResult } from "@/engines/core/types";
import { familyOriginTest } from "@/tests/family-origin/config";
import { getQuestions } from "@/tests/family-origin/questions";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";

type Screen = "home" | "test" | "result";

const QUESTION_TRANSITION_MS = 320;

export function SingleFileApp() {
  const questions = useMemo(() => getQuestions(), []);
  const [screen, setScreen] = useState<Screen>("home");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<ScoreResult>();
  const [resultError, setResultError] = useState<string>();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isLockedRef = useRef(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const startTest = () => {
    clearTransitionTimer();
    isLockedRef.current = false;
    setIsTransitioning(false);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(undefined);
    setResultError(undefined);
    setScreen("test");
    window.scrollTo({ top: 0 });
  };

  const handleAnswer = (option: Option) => {
    if (isLockedRef.current || isTransitioning) return;

    const question = questions[currentQuestionIndex];
    if (!question) return;

    const nextAnswer: Answer = {
      questionId: question.id,
      selectedOption: option,
    };
    const existingIndex = answers.findIndex(
      (answer) => answer.questionId === question.id
    );
    const nextAnswers = [...answers];

    if (existingIndex >= 0) {
      nextAnswers[existingIndex] = nextAnswer;
    } else {
      nextAnswers.push(nextAnswer);
    }

    setAnswers(nextAnswers);
    lockTransition();

    if (currentQuestionIndex === questions.length - 1) {
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  };

  const handleSubmit = () => {
    if (answers.length !== questions.length) {
      setResult(undefined);
      setResultError("仍有题目没有作答，请返回检查后再提交。");
      setScreen("result");
      return;
    }

    try {
      const scoreResult = familyOriginTest.scorer.score(answers);
      setResult(scoreResult);
      setResultError(undefined);
    } catch {
      setResult(undefined);
      setResultError("结果计算遇到问题，请返回后重新提交最后一题。");
    }

    setScreen("result");
    window.scrollTo({ top: 0 });
  };

  if (screen === "home") {
    return <HomeCover onStart={startTest} />;
  }

  if (screen === "result") {
    if (result) {
      return (
        <ResultShell
          result={result}
          testSlug={familyOriginTest.slug}
          testName={familyOriginTest.name}
          shareUrl={null}
          onRetake={startTest}
        />
      );
    }

    return (
      <main className={cn(ui.page, "flex min-h-screen items-center justify-center px-6")}>
        <div className="max-w-sm text-center">
          <p className={cn(ui.caption, "mb-2")}>结果计算</p>
          <h1 className={cn(ui.h2, "mb-4")}>暂时没有生成结果</h1>
          <p className={cn(ui.bodySm, "mb-8")}>
            {resultError || "答案尚未完整，请返回后继续完成测试。"}
          </p>
          <button
            onClick={() => {
              setScreen("test");
              setCurrentQuestionIndex(questions.length - 1);
            }}
            className={ui.btnPrimary}
          >
            返回最后一题
          </button>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (answer) => answer.questionId === currentQuestion?.id
  );

  return (
    <main className={cn(ui.page, "flex min-h-screen flex-col")}>
      <header className={cn(ui.container, "border-b border-divider py-6")}>
        <div className="flex items-center justify-between gap-4">
          <h1 className={ui.h3}>{familyOriginTest.name}</h1>
          <span className={cn(ui.caption, "shrink-0")}>
            {familyOriginTest.estimatedTime}
          </span>
        </div>
      </header>

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
                disabled={isTransitioning}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={cn(ui.container, "flex items-center justify-between gap-2 py-6")}>
        <button
          onClick={() => {
            if (isLockedRef.current || isTransitioning) return;
            clearTransitionTimer();
            isLockedRef.current = false;
            setIsTransitioning(false);
            setCurrentQuestionIndex((index) => Math.max(0, index - 1));
          }}
          disabled={currentQuestionIndex === 0 || isTransitioning}
          className={ui.btnGhost}
        >
          <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
          上一题
        </button>

        {currentAnswer && currentQuestionIndex < questions.length - 1 && (
          <button
            onClick={() => {
              if (isTransitioning) return;
              setCurrentQuestionIndex((index) => index + 1);
            }}
            disabled={isTransitioning}
            className={ui.btnPrimary}
          >
            下一题
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}

        {currentAnswer && currentQuestionIndex === questions.length - 1 && (
          <button
            onClick={handleSubmit}
            disabled={isTransitioning}
            className={ui.btnPrimary}
          >
            查看结果
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}

        <button
          onClick={() => {
            clearTransitionTimer();
            isLockedRef.current = false;
            setIsTransitioning(false);
            setAnswers([]);
            setCurrentQuestionIndex(0);
            setResult(undefined);
            setResultError(undefined);
          }}
          disabled={isTransitioning}
          className={ui.btnGhost}
        >
          <RotateCcw size={18} strokeWidth={1.5} aria-hidden="true" />
          重新开始
        </button>
      </div>
    </main>
  );
}
