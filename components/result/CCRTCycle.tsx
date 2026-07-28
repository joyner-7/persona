"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";

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
    { label: "我真正想要的", text: wish },
    { label: "关系里出现了什么", text: responseOfOther },
    { label: "我如何保护自己", text: responseOfSelf },
    { label: "最后留下了什么", text: consequence },
  ];

  return (
    <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-start">
      {steps.map((step, index) => (
        <div key={step.label} className="contents">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className={cn(
              ui.cardStatic,
              "my-2 p-5 md:min-h-44 md:border-l md:first:md:border-l-0",
              index > 0 && "md:ml-0"
            )}
          >
            <span className={cn(ui.label, "mb-4 block normal-case tracking-[0.08em]")}>
              {index + 1} · {step.label}
            </span>
            <p className={ui.bodySm}>{step.text}</p>
          </motion.div>
          {index < steps.length - 1 && (
            <div className="flex h-8 items-center justify-center text-text-muted md:h-44 md:px-2">
              <ArrowDown size={18} strokeWidth={1.5} className="md:hidden" aria-hidden="true" />
              <ArrowRight size={18} strokeWidth={1.5} className="hidden md:block" aria-hidden="true" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
