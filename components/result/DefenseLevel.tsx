"use client";

import { motion } from "framer-motion";

interface DefenseLevelProps {
  level: "mature" | "neurotic" | "immature";
  mechanisms: string[];
}

const levelConfig = {
  mature: {
    label: "灵活保护",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    barColor: "bg-green-500",
    description: "你比较能在需要、边界和现实之间来回调整，保护方式具有弹性。",
  },
  neurotic: {
    label: "紧绷保护",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    barColor: "bg-amber-500",
    description: "你会用一些很努力、很消耗的方式保护自己。它们曾经有用，但现在可能让你难以放松。",
  },
  immature: {
    label: "强力保护",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    barColor: "bg-red-500",
    description: "你可能发展出更强硬的自我保护方式，先确保不再受伤，再慢慢考虑靠近别人。",
  },
};

export function DefenseLevel({ level, mechanisms }: DefenseLevelProps) {
  const config = levelConfig[level];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
          {config.label}
        </div>
        <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: level === "mature" ? "33%" : level === "neurotic" ? "66%" : "100%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full ${config.barColor} rounded-full`}
          />
        </div>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">{config.description}</p>

      <div className="flex flex-wrap gap-2">
        {mechanisms.map((m, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-full text-sm"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
