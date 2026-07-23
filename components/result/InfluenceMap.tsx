"use client";

import { dimensionLabels } from "@/tests/family-origin/results";

interface Influence {
  dimension: string;
  score: number;
  impact: string;
}

interface InfluenceMapProps {
  influences: Influence[];
}

export function InfluenceMap({ influences }: InfluenceMapProps) {
  if (!influences?.length) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        你的各项信号比较均衡，没有特别突出的单一影响。
      </p>
    );
  }

  return (
    <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {influences.map((influence) => (
        <div
          key={influence.dimension}
          className="grid gap-2 py-4 md:grid-cols-[9rem_1fr] md:gap-5"
        >
          <span className="text-sm font-semibold">
            {dimensionLabels[influence.dimension]?.label || influence.dimension}
          </span>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {influence.impact}
          </p>
        </div>
      ))}
    </div>
  );
}
