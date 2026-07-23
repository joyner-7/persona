"use client";

import type { DimensionScore } from "@/engines/core/types";
import { dimensionLabels } from "@/tests/family-origin/results";
import { InfluenceMap } from "./InfluenceMap";
import { ThreeAxesChart } from "./ThreeAxesChart";

interface ResultEvidenceProps {
  dimensions: DimensionScore[];
  threeAxes: {
    warmth: number;
    control: number;
    neglect: number;
  };
  keyInfluences: {
    dimension: string;
    score: number;
    impact: string;
  }[];
  archetypeRatios: Record<string, number>;
  typeLabels: Record<string, string>;
  isMixedMode: boolean;
}

function getLevelLabel(dimension: DimensionScore) {
  const type = dimensionLabels[dimension.name]?.type;

  if (type === "positive") {
    if (dimension.level === "high") return "稳定资源";
    if (dimension.level === "low") return "资源偏弱";
    return "部分具备";
  }

  if (dimension.level === "high") return "影响明显";
  if (dimension.level === "low") return "影响较少";
  return "偶尔出现";
}

export function ResultEvidence({
  dimensions,
  threeAxes,
  keyInfluences,
  archetypeRatios,
  typeLabels,
  isMixedMode,
}: ResultEvidenceProps) {
  const sortedRatios = Object.entries(archetypeRatios).sort(
    (left, right) => right[1] - left[1]
  );

  return (
    <div className="space-y-10">
      <div>
        <h3 className="mb-2 font-semibold">三项综合信号</h3>
        <p className="mb-6 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          它们把六个原始维度组合成更接近日常体验的三个方向。百分比表示本次答案中的倾向强度，不是人群排名。
        </p>
        <ThreeAxesChart
          warmth={threeAxes.warmth}
          control={threeAxes.control}
          neglect={threeAxes.neglect}
        />
      </div>

      <div>
        <h3 className="mb-2 font-semibold">影响最明显的家庭经验</h3>
        <p className="mb-5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          系统从偏离中间区间最明显的维度中选出最多三项，作为本次结果的主要解释线索。
        </p>
        <InfluenceMap influences={keyInfluences} />
      </div>

      <details className="group border-y border-zinc-200 dark:border-zinc-800">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold">
          <span>查看六项原始维度与类型分布</span>
          <span className="text-xl font-normal text-zinc-400 transition-transform group-open:rotate-45">
            +
          </span>
        </summary>

        <div className="space-y-10 pb-8">
          <div>
            <div className="mb-5 space-y-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              <p>每个答案会记录一种脚本归属，同时累加相关维度权重。</p>
              <p>原始维度百分比 = 本次得分 ÷ 该维度理论最高分。</p>
              <p>
                主要类型取 20 次选择中归属比例最高者；若第二倾向达到主要倾向的 70%，结果会标记为混合型。
              </p>
            </div>

            <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {dimensions.map((dimension) => {
                const info = dimensionLabels[dimension.name];
                const isPositive = info?.type === "positive";

                return (
                  <div
                    key={dimension.name}
                    className="grid gap-3 py-5 md:grid-cols-[8rem_1fr_5rem] md:items-center md:gap-5"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {info?.label || dimension.leftLabel}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {getLevelLabel(dimension)}
                      </p>
                    </div>
                    <div>
                      <div className="h-1.5 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className={`h-full ${
                            isPositive ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${dimension.percentage}%` }}
                        />
                      </div>
                      {info?.description && (
                        <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                          {info.description}
                        </p>
                      )}
                    </div>
                    <p className="text-right text-sm font-bold tabular-nums">
                      {dimension.percentage}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">
              四种关系脚本的选择分布
              {isMixedMode && (
                <span className="ml-2 font-normal text-zinc-500">· 本次为混合结果</span>
              )}
            </h4>
            <div className="space-y-4">
              {sortedRatios.map(([type, ratio]) => (
                <div key={type} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3">
                  <span className="text-sm">{typeLabels[type] || type}</span>
                  <div className="h-1.5 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full bg-zinc-700 dark:bg-zinc-300"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <span className="text-right text-sm font-semibold tabular-nums">
                    {ratio}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
