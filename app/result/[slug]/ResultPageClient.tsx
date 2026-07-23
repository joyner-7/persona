"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTest } from "@/tests/_registry";
import { useTestStore } from "@/store/testStore";
import { ResultShell } from "@/components/result/ResultShell";

interface ResultPageProps {
  slug: string;
}

export default function ResultPage({ slug }: ResultPageProps) {
  const router = useRouter();
  const test = getTest(slug);
  const [mounted, setMounted] = useState(false);
  const session = useTestStore((s) => s.sessions[slug]);
  const reset = useTestStore((s) => s.reset);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!test) return notFound();

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !session.isCompleted || session.answers.length === 0) {
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

  const result = test.scorer.score(session.answers);

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
        focus={session.focus}
        onRetake={() => {
          reset(slug);
          router.push(`/test/${slug}`);
        }}
      />
    </motion.div>
  );
}
