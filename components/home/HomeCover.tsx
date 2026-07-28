"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";

interface HomeCoverProps {
  startHref?: string;
  onStart?: () => void;
}

const journeySteps = [
  { n: "01", text: "每一种反应，都有来处" },
  { n: "02", text: "有些模式，可以慢慢放下" },
  { n: "03", text: "探索，而非测试" },
];

/** 主视觉：打开的书页 + 关系连结 + 植物线稿 */
function HeroVisual() {
  return (
    <div
      className="relative mx-auto aspect-[5/6] w-full max-w-md lg:max-w-none lg:aspect-auto lg:min-h-[26rem]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-[24px] border border-[#ECE6DF] bg-[#FFFCF8] shadow-[0_10px_40px_rgba(69,63,58,0.06)]" />
      <div
        className="absolute inset-0 rounded-[24px] opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(181,138,99,0.07) 0%, transparent 70%)",
        }}
      />

      <svg viewBox="0 0 420 500" className="absolute inset-0 h-full w-full" fill="none">
        {/* 书页 — 左页 */}
        <path
          d="M60 90 C60 90 60 410 60 410 C60 430 90 440 120 430 L205 400 C205 400 205 120 205 120 C205 100 180 85 155 88 L60 90 Z"
          fill="#F8F4EF"
          stroke="#B58A63"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        {/* 书页 — 右页 */}
        <path
          d="M360 90 C360 90 360 410 360 410 C360 430 330 440 300 430 L215 400 C215 400 215 120 215 120 C215 100 240 85 265 88 L360 90 Z"
          fill="#FFFCF8"
          stroke="#B58A63"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        {/* 书脊阴影 */}
        <line x1="210" y1="115" x2="210" y2="395" stroke="#B58A63" strokeOpacity="0.12" strokeWidth="1.5" />

        {/* 左页文字线（示意阅读） */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`l-${i}`}
            x1="85"
            y1={160 + i * 28}
            x2={i % 2 === 0 ? "175" : "155"}
            y2={160 + i * 28}
            stroke="#B58A63"
            strokeOpacity={0.08 + (i === 0 ? 0.04 : 0)}
            strokeWidth="1"
            strokeLinecap="round"
          />
        ))}

        {/* 右页：关系双圆 + 连结线 */}
        <circle cx="290" cy="210" r="36" stroke="#B58A63" strokeOpacity="0.25" strokeWidth="1" />
        <circle cx="290" cy="210" r="5" fill="#B58A63" fillOpacity="0.3" />
        <circle cx="250" cy="260" r="28" stroke="#B58A63" strokeOpacity="0.18" strokeWidth="1" />
        <circle cx="250" cy="260" r="4" fill="#B58A63" fillOpacity="0.22" />
        <path
          d="M268 232 Q278 248 262 258"
          stroke="#B58A63"
          strokeOpacity="0.2"
          strokeWidth="0.75"
          strokeDasharray="3 4"
        />

        {/* 右页：小型生长曲线 */}
        <path
          d="M240 310 Q255 290 270 300 T295 285"
          stroke="#B58A63"
          strokeOpacity="0.15"
          strokeWidth="0.75"
        />

        {/* 从书中生长的枝桠 */}
        <path
          d="M210 400 C210 370 195 350 180 320 C165 290 175 260 200 240 C225 220 240 235 235 260 C230 285 210 300 210 330"
          stroke="#B58A63"
          strokeOpacity="0.35"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M200 275 C185 265 172 255 168 240 M200 275 C215 262 228 248 232 232"
          stroke="#B58A63"
          strokeOpacity="0.22"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
        <path
          d="M195 310 C188 302 182 295 180 288 M195 310 C202 300 210 292 215 285"
          stroke="#B58A63"
          strokeOpacity="0.16"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        {/* 叶片 */}
        <ellipse cx="168" cy="236" rx="8" ry="14" transform="rotate(-30 168 236)" stroke="#B58A63" strokeOpacity="0.2" strokeWidth="0.75" />
        <ellipse cx="234" cy="228" rx="7" ry="12" transform="rotate(25 234 228)" stroke="#B58A63" strokeOpacity="0.18" strokeWidth="0.75" />

        {/* 底部桌面线 */}
        <path d="M40 420 Q210 435 380 420" stroke="#B58A63" strokeOpacity="0.1" strokeWidth="0.75" />

        {/* 书签 */}
        <path
          d="M210 95 L210 145 L218 138 L226 145 L226 95"
          fill="#B58A63"
          fillOpacity="0.12"
          stroke="#B58A63"
          strokeOpacity="0.25"
          strokeWidth="0.75"
        />
      </svg>
    </div>
  );
}

/** 三句合一：单块有机面板 + 流动路径 */
function JourneyPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="relative overflow-hidden rounded-[24px] border border-[#ECE6DF] bg-[#FFFCF8] px-8 py-10 shadow-[0_8px_32px_rgba(69,63,58,0.05)] sm:px-12 sm:py-12"
    >
      {/* 背景流动曲线 */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-[#B58A63]"
        viewBox="0 0 800 280"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 200 C120 160 180 220 320 180 S520 120 680 160 S760 200 800 140"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
        <path
          d="M0 240 C200 200 280 260 420 210 S600 170 800 200"
          stroke="currentColor"
          strokeOpacity="0.05"
          strokeWidth="0.75"
        />
        {/* 连接三点的路径 */}
        <path
          d="M80 140 C200 100 280 180 400 140 S600 80 720 140"
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle cx="80" cy="140" r="4" fill="currentColor" fillOpacity="0.2" />
        <circle cx="400" cy="140" r="4" fill="currentColor" fillOpacity="0.2" />
        <circle cx="720" cy="140" r="4" fill="currentColor" fillOpacity="0.2" />
      </svg>

      <div className="relative flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {journeySteps.map((step, i) => (
          <div key={step.n} className="relative flex-1 text-center sm:px-2">
            {i < journeySteps.length - 1 && (
              <span
                className="absolute right-0 top-5 hidden h-px w-8 translate-x-1/2 bg-[#ECE6DF] sm:block lg:w-12"
                aria-hidden="true"
              />
            )}
            <p className="text-[10px] tracking-[0.2em] text-[#B58A63]">{step.n}</p>
            <p className="mt-3 font-serif text-[15px] leading-snug text-[#453F3A] sm:text-base">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StartButton({ startHref, onStart }: { startHref?: string; onStart?: () => void }) {
  const className = cn(ui.btnPrimary, "min-h-[3.25rem] px-10 text-[15px]");
  const content = (
    <>
      <span>从这里，重新认识自己</span>
      <ArrowRight size={18} strokeWidth={1.5} className="text-[#B58A63]" />
    </>
  );
  if (startHref) return <a href={startHref} className={className}>{content}</a>;
  return <button type="button" onClick={onStart} className={className}>{content}</button>;
}

export function HomeCover({ startHref, onStart }: HomeCoverProps) {
  return (
    <main className="relative min-h-screen bg-[#FAF8F5] text-[#453F3A]">
      {/* 轻量背景 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 品牌 */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto flex w-full max-w-[68rem] items-center gap-3 px-6 py-8 sm:px-10"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ECE6DF] bg-[#FFFCF8]" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#B58A63]" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.5" />
          </svg>
        </div>
        <div>
          <p className="font-serif text-sm font-medium">Persona</p>
          <p className="text-[10px] tracking-[0.16em] text-[#8B847D] uppercase">Understand Yourself</p>
        </div>
      </motion.header>

      {/* Hero：纯阅读，无入口 */}
      <section className="relative mx-auto w-full max-w-[68rem] px-6 sm:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mb-6 text-[10px] tracking-[0.22em] text-[#8B847D] uppercase"
            >
              关系脚本
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="font-serif text-[1.875rem] font-medium leading-[1.28] tracking-[-0.02em] md:text-[2.5rem] lg:text-[2.625rem]"
            >
              原生家庭的影响，
              <br />
              还在今天发生
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="mt-6 max-w-sm text-base leading-[1.85] text-[#8B847D]"
            >
              许多反应模式，并非天生如此，而是早在那里悄悄学会。
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </section>

      {/* 三句合一 */}
      <section className="relative mx-auto mt-16 w-full max-w-[68rem] px-6 sm:mt-20 sm:px-10">
        <JourneyPanel />
      </section>

      {/* 入口置底 */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35 }}
        className="relative mx-auto w-full max-w-[68rem] px-6 py-20 text-center sm:px-10 sm:py-24"
      >
        <div className="mx-auto max-w-sm">
          <p className="mb-8 font-serif text-base italic text-[#8B847D]">
            给自己一点时间，安静地重新认识自己
          </p>
          <StartButton startHref={startHref} onStart={onStart} />
          <p className="mt-5 text-sm text-[#B4ACA5]">约 8 分钟 · 完全私密</p>
        </div>
      </motion.section>
    </main>
  );
}
