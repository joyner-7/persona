"use client";

import type { DimensionScore } from "@/engines/core/types";
import { dimensionLabels } from "@/tests/family-origin/results";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
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

const CHART_STROKE = "#B48A64";
const CHART_FILL = "rgba(180, 138, 100, 0.14)";
const GRID_STROKE = "#E8E3DD";

export function ResultEvidence({ dimensions }: ResultEvidenceProps) {
  const radarData = dimensions.map((dimension) => ({
    label: dimensionLabels[dimension.name]?.label || dimension.leftLabel,
    score: dimension.percentage,
  }));

  return (
    <div>
      <div
        data-result-chart
        className="mx-auto mb-10 h-72 w-full max-w-md text-text-muted"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="52%" outerRadius="67%">
            <PolarGrid stroke={GRID_STROKE} />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "#8C847C", fontSize: 11 }}
            />
            <Radar
              dataKey="score"
              stroke={CHART_STROKE}
              fill={CHART_FILL}
              fillOpacity={1}
              strokeWidth={1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {dimensions.map((dimension) => {
          const info = dimensionLabels[dimension.name];

          return (
            <div
              key={dimension.name}
              className={cn(ui.cardStatic, "min-h-28 p-5 hover:translate-y-0 hover:shadow-card")}
            >
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <p className="text-base text-text">{info?.label || dimension.leftLabel}</p>
                <p className="text-sm tabular-nums text-accent">
                  {dimension.percentage}%
                </p>
              </div>
              <p className={ui.bodySm}>{info?.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
