"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound } from "lucide-react";
import {
  isValidLicenseCode,
  normalizeLicenseCode,
  readLicenseSession,
  saveLicenseSession,
} from "@/lib/auth/license";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function AuthCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let frame: number | null = null;

    if (readLicenseSession()) {
      router.replace("/home");
    } else {
      frame = requestAnimationFrame(() => setCheckingSession(false));
    }

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = normalizeLicenseCode(code);
    if (!isValidLicenseCode(normalizedCode)) {
      setError("授权码无效，请核对后重新输入");
      return;
    }

    saveLicenseSession(normalizedCode);
    router.replace("/home");
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <div className={ui.spinner} />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-text">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[68rem] flex-col px-6 py-8 sm:px-10">
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-card bg-card"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
              <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.5" />
            </svg>
          </div>
          <div>
            <p className="font-serif text-sm font-medium">Persona</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-text-sub">
              Private Access
            </p>
          </div>
        </motion.header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="max-w-md"
          >
            <p className={cn(ui.label, "mb-6")}>授权访问</p>
            <h1 className="font-serif text-[1.875rem] font-medium leading-[1.28] tracking-[-0.02em] md:text-[2.5rem]">
              输入授权码，
              <br />
              开始这次自我探索
            </h1>
            <p className="mt-6 text-base leading-[1.9] text-text-sub">
              这是一份私密的关系脚本测评。授权码验证通过后，答题进度会保存在你的浏览器中。
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[24px] border border-border-card bg-card px-6 py-8 shadow-card sm:px-8 sm:py-10"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(180,138,100,0.08) 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-tag-border bg-accent-soft text-accent">
                <KeyRound size={20} strokeWidth={1.5} />
              </div>

              <label htmlFor="license-code" className="font-serif text-xl font-medium">
                授权码
              </label>
              <p className="mt-2 text-sm leading-6 text-text-sub">
                输入客服发给你的授权码，字母大小写不影响验证。
              </p>

              <input
                id="license-code"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  if (error) setError("");
                }}
                autoComplete="one-time-code"
                spellCheck={false}
                placeholder="ABCDEF"
                className="mt-7 h-14 w-full rounded-card border border-border-card bg-bg px-5 text-center font-sans text-xl tracking-[0.18em] text-text outline-none transition-colors placeholder:text-text-muted focus:border-accent/50"
              />

              {error && (
                <p className="mt-4 text-sm leading-6 text-[#9E4B40]">{error}</p>
              )}

              <button
                type="submit"
                className={cn(ui.btnPrimary, "mt-7 w-full min-h-[3.25rem]")}
              >
                进入测评
                <ArrowRight size={18} strokeWidth={1.5} className="text-accent" />
              </button>
            </div>
          </motion.form>
        </section>
      </div>
    </main>
  );
}
