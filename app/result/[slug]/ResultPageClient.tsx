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
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";

interface ResultPageProps {
  slug: string;
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className={cn(ui.page, "flex items-center justify-center px-6")}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-sm text-center"
      >
        <h1 className={cn(ui.h2, "mb-5")}>{title}</h1>
        <p className={cn(ui.bodySm, "mb-10")}>{description}</p>
        <button onClick={onAction} className={ui.btnPrimary}>
          {actionLabel}
        </button>
      </motion.div>
    </div>
  );
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
      <div className={cn(ui.page, "flex items-center justify-center")}>
        <div className={ui.spinner} />
      </div>
    );
  }

  if (shouldShowInvalidSnapshot) {
    return (
      <EmptyState
        title="结果链接已失效"
        description="这个分享链接里的结果数据无法读取。你可以重新完成 20 个场景选择，生成一份新的关系脚本地图。"
        actionLabel="开始测试"
        onAction={() => router.push(`/test/${slug}`)}
      />
    );
  }

  if (!canShowResult) {
    return (
      <EmptyState
        title="尚未完成测试"
        description="先完成 20 个场景选择，再查看你的关系脚本地图。"
        actionLabel="开始测试"
        onAction={() => router.push(`/test/${slug}`)}
      />
    );
  }

  const result = test.scorer.score(activeAnswers);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={ui.page}
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
