import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { ResultShell } from "@/components/result/ResultShell";
import { HomeCover } from "@/components/home/HomeCover";
import { ProgressBar } from "@/components/test/ProgressBar";
import { QuestionCard } from "@/components/test/QuestionCard";
import type { Answer, Option, ScoreResult } from "@/engines/core/types";
import { familyOriginTest } from "@/tests/family-origin/config";
import { getQuestions } from "@/tests/family-origin/questions";

type Screen = "home" | "test" | "result";

export function SingleFileApp() {
  const questions = useMemo(() => getQuestions(), []);
  const [screen, setScreen] = useState<Screen>("home");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<ScoreResult>();
  const [resultError, setResultError] = useState<string>();

  const startTest = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(undefined);
    setResultError(undefined);
    setScreen("test");
    window.scrollTo({ top: 0 });
  };

  const handleAnswer = (option: Option) => {
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
      <main className="flex min-h-screen items-center justify-center bg-white px-5 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="max-w-sm text-center">
          <p className="mb-2 text-sm font-medium text-zinc-500">结果计算</p>
          <h1 className="mb-4 text-2xl font-bold">暂时没有生成结果</h1>
          <p className="mb-6 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {resultError || "答案尚未完整，请返回后继续完成测试。"}
          </p>
          <button
            onClick={() => {
              setScreen("test");
              setCurrentQuestionIndex(questions.length - 1);
            }}
            className="min-h-12 bg-zinc-950 px-6 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
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
    <main className="flex min-h-screen flex-col bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <h1 className="text-base font-semibold md:text-lg">
            {familyOriginTest.name}
          </h1>
          <span className="shrink-0 text-sm text-zinc-500">
            {familyOriginTest.estimatedTime}
          </span>
        </div>
      </header>

      <ProgressBar current={currentQuestionIndex} total={questions.length} />

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              selectedOption={currentAnswer?.selectedOption.value}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-2 px-4 py-4">
        <button
          onClick={() => setCurrentQuestionIndex((index) => Math.max(0, index - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex min-h-11 items-center gap-2 px-3 text-sm text-zinc-600 transition-colors hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-30 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          上一题
        </button>

        {currentAnswer && currentQuestionIndex < questions.length - 1 && (
          <button
            onClick={() => setCurrentQuestionIndex((index) => index + 1)}
            className="flex min-h-11 items-center gap-2 bg-zinc-950 px-5 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
          >
            下一题
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}

        {currentAnswer && currentQuestionIndex === questions.length - 1 && (
          <button
            onClick={handleSubmit}
            className="flex min-h-11 items-center gap-2 bg-zinc-950 px-5 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
          >
            查看结果
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}

        <button
          onClick={() => {
            setAnswers([]);
            setCurrentQuestionIndex(0);
            setResult(undefined);
            setResultError(undefined);
          }}
          className="flex min-h-11 items-center gap-2 px-3 text-sm text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <RotateCcw size={16} aria-hidden="true" />
          重新开始
        </button>
      </div>
    </main>
  );
}
