"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";

interface CCRTCycleProps {
  wish: string;
  responseOfOther: string;
  responseOfSelf: string;
  consequence: string;
}

export function CCRTCycle({
  wish,
  responseOfOther,
  responseOfSelf,
  consequence,
}: CCRTCycleProps) {
  const steps = [
    { label: "我想要", text: wish },
    { label: "我预期对方", text: responseOfOther },
    { label: "于是我", text: responseOfSelf },
    { label: "关系最后", text: consequence },
  ];

  return (
    <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-start">
      {steps.map((step, index) => (
        <div key={step.label} className="contents">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="border-t border-zinc-200 py-5 dark:border-zinc-800 md:min-h-44 md:border-l md:border-t-0 md:px-4 md:py-4 first:md:border-l-0 first:md:pl-0 last:md:pr-0"
          >
            <span className="mb-3 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {index + 1} · {step.label}
            </span>
            <p className="text-sm leading-6">{step.text}</p>
          </motion.div>
          {index < steps.length - 1 && (
            <div className="flex h-6 items-center justify-center text-zinc-300 dark:text-zinc-700 md:h-44 md:px-1">
              <ArrowDown size={17} className="md:hidden" aria-hidden="true" />
              <ArrowRight size={17} className="hidden md:block" aria-hidden="true" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
