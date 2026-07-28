import { cn } from "@/lib/utils";

/** 杂志风设计系统 — 统一 UI 类名 */
export const ui = {
  page: "min-h-screen bg-bg text-text",
  container: "mx-auto w-full max-w-content px-6 sm:px-8 md:px-10",

  /** 标题 — 衬线、文学感 */
  h1: "font-serif text-[1.875rem] font-medium leading-snug tracking-[-0.01em] text-text md:text-[2.375rem]",
  h2: "font-serif text-[1.375rem] font-medium leading-snug text-text md:text-[1.625rem]",
  h3: "font-serif text-lg font-medium leading-relaxed text-text",

  /** 正文层级 */
  subtitle: "text-lg leading-[1.9] text-text-sub",
  body: "text-base leading-[1.9] text-text",
  bodySm: "text-sm leading-[1.9] text-text-sub",
  caption: "text-sm text-text-muted",
  label: "text-xs tracking-[0.12em] text-text-muted uppercase",

  /** 卡片 */
  card: cn(
    "rounded-card border border-border-card bg-card",
    "shadow-card transition-all duration-300",
    "hover:-translate-y-0.5 hover:shadow-card-hover"
  ),
  cardStatic: "rounded-card border border-border-card bg-card shadow-card",

  /** 标签胶囊 */
  tag: cn(
    "inline-flex h-9 items-center gap-2 rounded-pill border border-tag-border",
    "bg-card px-4 text-sm text-text-sub",
    "transition-colors duration-300 hover:bg-accent-soft"
  ),

  /** 按钮 */
  btnPrimary: cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill",
    "border border-tag-border bg-card px-7 text-sm text-text",
    "shadow-card transition-all duration-300",
    "hover:-translate-y-0.5 hover:bg-accent-soft hover:shadow-card-hover",
    "active:translate-y-0"
  ),
  btnSecondary: cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill",
    "border border-border-card bg-transparent px-7 text-sm text-text-sub",
    "transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-soft hover:text-text"
  ),
  btnGhost: cn(
    "inline-flex items-center gap-2 text-sm text-text-sub",
    "transition-colors duration-300 hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
  ),

  /** 分割 */
  divider: "my-8 border-t border-divider sm:my-10",

  /** 引用块 */
  blockquote: "border-l border-accent/40 pl-5",
  blockquoteText: "text-base leading-[1.9] text-text-sub italic",
  blockquoteCite: "mt-3 block text-sm not-italic text-text-muted",

  /** 选项按钮（测试页） */
  option: cn(
    "w-full min-h-[4rem] rounded-card border border-border-card bg-card",
    "flex items-center gap-4 px-5 py-4 text-left text-base leading-[1.9] text-text",
    "transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent-soft/50"
  ),
  optionSelected: cn(
    "border-accent/50 bg-accent-soft shadow-card"
  ),

  /** 章节 */
  section: "py-12 first:pt-0 sm:py-14 md:py-16",
  sectionIndex: "text-xs tracking-[0.16em] text-text-muted",

  /** 加载 spinner */
  spinner: "h-7 w-7 animate-spin rounded-full border-2 border-border border-t-accent",
} as const;
