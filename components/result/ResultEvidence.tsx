"use client";

import type { DimensionScore } from "@/engines/core/types";
import { dimensionLabels } from "@/tests/family-origin/results";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface ResultEvidenceProps {
  dimensions: DimensionScore[];
}

export function ResultEvidence({ dimensions }: ResultEvidenceProps) {
  const radarData = dimensions.map((dimension) => ({
    label: dimensionLabels[dimension.name]?.label || dimension.leftLabel,
    score: dimension.percentage,
  }));

  return (
    <div>
      <div className="mx-auto h-72 w-full max-w-md">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="52%" outerRadius="67%">
            <PolarGrid stroke="currentColor" strokeOpacity={0.13} />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "currentColor", fillOpacity: 0.62, fontSize: 11 }}
            />
            <Radar
              dataKey="score"
              stroke="#71717a"
              fill="#71717a"
              fillOpacity={0.16}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {dimensions.map((dimension) => {
          const info = dimensionLabels[dimension.name];

          return (
            <div
              key={dimension.name}
              className="min-h-28 rounded-lg border border-zinc-200 px-4 py-3.5 dark:border-zinc-800"
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium">
                  {info?.label || dimension.leftLabel}
                </p>
                <p className="text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
                  {dimension.percentage}%
                </p>
              </div>
              <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                {info?.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
