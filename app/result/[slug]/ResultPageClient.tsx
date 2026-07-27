"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Answer, Question } from "@/engines/core/types";
import { useTestStore } from "@/store/testStore";
import { getTest } from "@/tests/_registry";
import {
  buildSharedResultUrl,
  createSharedResultSnapshot,
  parseSharedResultSnapshot,
  type SharedResultSnapshot,
} from "@/lib/result-share";
import { ResultShell } from "@/components/result/ResultShell";

interface ResultPageProps {
  slug: string;
}

export default function ResultPage({ slug }: ResultPageProps) {
  const router = useRouter();
  const test = getTest(slug);
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [snapshotState] = useState(() => {
    if (typeof window === "undefined") {
      return {
        status: "pending" as const,
        snapshot: null as SharedResultSnapshot | null,
      };
    }

    const rawSnapshot = new URLSearchParams(window.location.search).get(
      "snapshot"
    );
    const parsedSnapshot = parseSharedResultSnapshot(rawSnapshot);

    return {
      status:
        rawSnapshot && !parsedSnapshot
          ? ("invalid" as const)
          : ("ready" as const),
      snapshot: parsedSnapshot,
    };
  });
  const session = useTestStore((s) => s.sessions[slug]);
  const reset = useTestStore((s) => s.reset);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!test) return;
    const activeTest = test;

    let cancelled = false;

    async function loadQuestions() {
      const loadedQuestions = await Promise.resolve(activeTest.getQuestions());
      if (!cancelled) {
        setQuestions(loadedQuestions);
        setLoadingQuestions(false);
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [test]);

  const sharedAnswers = useMemo<Answer[]>(() => {
    if (!snapshotState.snapshot || questions.length === 0) return [];

    const questionMap = new Map(questions.map((question) => [question.id, question]));

    return snapshotState.snapshot.answers.flatMap((answer) => {
      const question = questionMap.get(answer.questionId);
      const option = question?.options.find(
        (candidate) => candidate.value === answer.optionValue
      );

      if (!question || !option) return [];

      return [
        {
          questionId: question.id,
          selectedOption: option,
        },
      ];
    });
  }, [questions, snapshotState.snapshot]);

  const hasCompleteSharedSnapshot =
    Boolean(snapshotState.snapshot) && sharedAnswers.length === questions.length;
  const localSessionIsComplete =
    session?.isCompleted && session.answers.length > 0;
  const activeAnswers = hasCompleteSharedSnapshot
    ? sharedAnswers
    : session?.answers ?? [];
  const canShowResult =
    hasCompleteSharedSnapshot || localSessionIsComplete;
  const activeFocus = hasCompleteSharedSnapshot
    ? snapshotState.snapshot?.focus
    : session?.focus;
  const activeSnapshot = hasCompleteSharedSnapshot
    ? snapshotState.snapshot
    : localSessionIsComplete
    ? createSharedResultSnapshot(session.answers, session.focus)
    : null;
  const shouldShowInvalidSnapshot =
    (snapshotState.status === "invalid" ||
      (Boolean(snapshotState.snapshot) && !hasCompleteSharedSnapshot)) &&
    !localSessionIsComplete;
  const shareUrl =
    mounted && activeSnapshot
      ? buildSharedResultUrl(window.location.origin, slug, activeSnapshot)
      : null;

  if (!test) return notFound();

  if (!mounted || loadingQuestions || snapshotState.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (shouldShowInvalidSnapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold mb-4">结果链接已失效</h1>
          <p className="text-zinc-500 mb-6">
            这个分享链接里的结果数据无法读取。你可以重新完成 20 个场景选择，生成一份新的关系脚本地图。
          </p>
          <button
            onClick={() => router.push(`/test/${slug}`)}
            className="px-6 py-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full font-medium"
          >
            开始测试
          </button>
        </div>
      </div>
    );
  }

  if (!canShowResult) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold mb-4">尚未完成测试</h1>
          <p className="text-zinc-500 mb-6">
            先完成 20 个场景选择，再查看你的关系脚本地图。
          </p>
          <button
            onClick={() => router.push(`/test/${slug}`)}
            className="px-6 py-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full font-medium"
          >
            开始测试
          </button>
        </div>
      </div>
    );
  }

  const result = test.scorer.score(activeAnswers);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <ResultShell
        result={result}
        testSlug={slug}
        testName={test.name}
        focus={activeFocus}
        onRetake={() => {
          reset(slug);
          router.push(`/test/${slug}`);
        }}
        shareUrl={shareUrl}
      />
    </motion.div>
  );
}
