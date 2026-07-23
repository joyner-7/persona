import { ArrowRight } from "lucide-react";
import Link from "next/link";

const focusOptions = [
  {
    label: "亲密关系",
    href: "/test/family-origin?focus=relationships",
    description: "我为什么靠近、退后、讨好或防备",
  },
  {
    label: "自我价值",
    href: "/test/family-origin?focus=self_worth",
    description: "我如何把被爱和表现绑在一起",
  },
  {
    label: "边界控制",
    href: "/test/family-origin?focus=boundaries",
    description: "我在哪里过度负责，哪里难以拒绝",
  },
  {
    label: "情绪表达",
    href: "/test/family-origin?focus=emotion",
    description: "我如何处理脆弱、需要和求助",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col px-4 py-10">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
            家庭脚本 · 自我理解工具
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            看见你从家里带来的关系脚本
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            通过 20 个身体感受与关系场景，理解你如何习得亲密、自主、价值感和边界。
            这不是给家人或自己下诊断，而是画出一张可以继续修改的内在地图。
          </p>

          <Link
            href="/test/family-origin"
            className="inline-flex items-center gap-2 px-7 py-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-base font-medium hover:opacity-90 transition-opacity group"
          >
            直接开始
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <section className="mt-12">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
            也可以先选择这次最想理解的部分
          </h2>
          <div className="grid gap-3 md:grid-cols-4">
            {focusOptions.map((option) => (
              <Link
                key={option.href}
                href={option.href}
                className="group border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-medium">{option.label}</span>
                  <ArrowRight
                    size={16}
                    className="text-zinc-400 group-hover:translate-x-1 transition-transform"
                  />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {option.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
