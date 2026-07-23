"use client";

import { motion } from "framer-motion";

const sections = [
  {
    emoji: "💫",
    text: "你的每一种靠近、退后、沉默或讨好，都有自己的来处。",
    featured: true,
  },
  {
    emoji: "🎁",
    text: "有些模式，是成长送给我们的礼物；有些模式，也许已经到了可以慢慢放下的时候。",
  },
  {
    emoji: "🌱",
    text: "这不是一次测试，而是一场关于自己的探索。",
  },
];

interface HomeCoverProps {
  startHref?: string;
  onStart?: () => void;
}

export function HomeCover({ startHref, onStart }: HomeCoverProps) {
  const buttonClassName =
    "inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 rounded-full bg-zinc-900 px-8 text-[15px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-[0_1px_2px_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.35)] dark:hover:bg-white";

  const buttonContent = (
    <>
      <span className="text-[17px]" aria-hidden="true">
        🌿
      </span>
      <span>从这里，重新认识自己</span>
    </>
  );

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#fbfbfb] px-6 py-14 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 md:px-10 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(120,120,128,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.04),transparent)]" />
      <div className="pointer-events-none absolute top-[12%] right-[8%] h-32 w-32 rounded-full bg-zinc-200/30 blur-3xl dark:bg-zinc-800/40" />
      <div className="pointer-events-none absolute bottom-[18%] left-[6%] h-40 w-40 rounded-full bg-zinc-200/20 blur-3xl dark:bg-zinc-800/30" />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[13px] font-medium text-zinc-500 ring-1 ring-zinc-200/80 backdrop-blur-sm dark:bg-zinc-900/80 dark:text-zinc-400 dark:ring-zinc-800">
              <span aria-hidden="true">🪞</span>
              关系脚本
            </span>
          </div>

          <div className="mb-10 space-y-4">
            {sections.map((section, index) => (
              <motion.div
                key={section.emoji}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + index * 0.07,
                  duration: 0.45,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`rounded-[1.35rem] p-5 ring-1 backdrop-blur-sm md:p-6 ${
                  section.featured
                    ? "bg-white/90 ring-zinc-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.04)] dark:bg-zinc-900/90 dark:ring-zinc-800 dark:shadow-none"
                    : "bg-white/60 ring-zinc-200/50 dark:bg-zinc-900/60 dark:ring-zinc-800/80"
                }`}
              >
                <div className="flex gap-4">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-lg dark:bg-zinc-800"
                    aria-hidden="true"
                  >
                    {section.emoji}
                  </span>
                  <p
                    className={`leading-[1.75] text-zinc-600 dark:text-zinc-300 ${
                      section.featured
                        ? "pt-0.5 text-[1.125rem] font-medium tracking-[-0.01em] text-zinc-900 dark:text-zinc-100 md:text-[1.25rem]"
                        : "pt-1 text-[15px] md:text-base"
                    }`}
                  >
                    {section.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-5 sm:items-start">
            {startHref ? (
              <a href={startHref} className={buttonClassName}>
                {buttonContent}
              </a>
            ) : (
              <button type="button" onClick={onStart} className={buttonClassName}>
                {buttonContent}
              </button>
            )}

            <p className="text-center text-[13px] text-zinc-400 sm:text-left dark:text-zinc-500">
              约 8 分钟 · 20 个场景 · 完全私密
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
