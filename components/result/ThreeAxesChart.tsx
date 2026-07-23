"use client";

interface ThreeAxesProps {
  warmth: number;
  control: number;
  neglect: number;
}

export function ThreeAxesChart({ warmth, control, neglect }: ThreeAxesProps) {
  const signals = [
    {
      label: "关系可依靠感",
      value: warmth,
      description: "是否习惯把关系体验为可以回应需要的地方",
      color: "bg-emerald-500",
    },
    {
      label: "选择警觉",
      value: control,
      description: "做决定时，会多大程度先预判别人的反应",
      color: "bg-amber-500",
    },
    {
      label: "需求收回",
      value: neglect,
      description: "感到脆弱时，会多大程度先独自消化",
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {signals.map((signal) => (
        <div key={signal.label}>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium">{signal.label}</span>
            <span className="text-lg font-bold tabular-nums">{signal.value}%</span>
          </div>
          <div className="mb-3 h-1.5 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full ${signal.color}`}
              style={{ width: `${signal.value}%` }}
            />
          </div>
          <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {signal.description}
          </p>
        </div>
      ))}
    </div>
  );
}
