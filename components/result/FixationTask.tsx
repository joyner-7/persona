"use client";

import { motion } from "framer-motion";
import { ArrowRight, Target, Sprout } from "lucide-react";

interface FixationTaskProps {
  fixationPoint: string;
  developmentalTask: string;
}

export function FixationTask({ fixationPoint, developmentalTask }: FixationTaskProps) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <Target size={16} className="text-zinc-500" />
          <span className="text-sm font-medium text-zinc-500">旧脚本</span>
        </div>
        <p className="text-sm leading-relaxed">{fixationPoint}</p>
      </motion.div>

      <div className="flex justify-center">
        <ArrowRight size={20} className="text-zinc-400 rotate-90" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sprout size={16} />
          <span className="text-sm font-medium">下一步练习</span>
        </div>
        <p className="text-sm leading-relaxed opacity-90">{developmentalTask}</p>
      </motion.div>
    </div>
  );
}
