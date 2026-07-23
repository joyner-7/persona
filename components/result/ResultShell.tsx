"use client";

import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Share2, Sparkles } from "lucide-react";
import { ScoreResult } from "@/engines/core/types";
import type { ReflectionFocus } from "@/store/testStore";
import { CCRTCycle } from "./CCRTCycle";
import { ResultEvidence } from "./ResultEvidence";

interface ResultShellProps {
  result: ScoreResult;
  testSlug: string;
  testName: string;
  focus?: ReflectionFocus;
  onRetake: () => void;
  shareUrl?: string | null;
}

interface NarrativeMeta {
  primaryType: string;
  archetypeRatios: Record<string, number>;
  isMixedMode: boolean;
  mixedArchetypes?: string[];
  threeAxes: {
    warmth: number;
    control: number;
    neglect: number;
  };
  ccrt: {
    wish: string;
    responseOfOther: string;
    responseOfSelf: string;
    consequence: string;
  };
  defenseMechanisms: string[];
  fixationPoint: string;
  developmentalTask: string;
  keyInfluences: {
    dimension: string;
    score: number;
    impact: string;
  }[];
}

interface TypeReport {
  label: string;
  summary: string;
  quote: string;
  quoteSource: string;
  quoteNote: string;
  coreRule: string;
  strength: string;
  cost: string;
  trigger: string;
  accent: string;
  softAccent: string;
  scenes: { label: string; title: string; body: string }[];
}

const typeReports: Record<string, TypeReport> = {
  A: {
    label: "稳定连接型",
    summary:
      "你通常相信关系可以回应需要，也比较能在亲近和独立之间找到自己的位置。",
    quote: "正因为你为你的玫瑰花费了时间，这才使你的玫瑰变得如此重要。",
    quoteSource: "圣埃克苏佩里《小王子》",
    quoteNote: "关系的珍贵来自持续投入，而不是彼此占有。对你来说，稳定连接的下一步不是一味维持和谐，而是让亲近、分歧和个人空间能够同时存在。",
    coreRule: "关系可以容纳需要、分歧与边界，不必靠牺牲自己来维持。",
    strength: "你较能信任、求助、回应他人，也能在关系之外保有自己的生活。",
    cost: "你可能低估他人的警觉与退缩，或太快相信沟通一定能解决问题。",
    trigger: "长期冷处理、反复越界或只有一方努力修复，会让你明显失去安全感。",
    accent: "bg-emerald-600",
    softAccent:
      "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
    scenes: [
      {
        label: "在亲密里",
        title: "你愿意靠近，也允许彼此有空间",
        body: "你通常能表达喜欢、需要和不舒服，不会把依赖自动理解为软弱，也不会把独立理解为疏远。",
      },
      {
        label: "在冲突里",
        title: "你更关注修复，而不是输赢",
        body: "出现分歧时，你倾向于把问题说清楚，并期待双方都为关系做一点调整。",
      },
      {
        label: "面对自己",
        title: "一次失误不太容易动摇全部价值感",
        body: "你比较能把“我做错了一件事”和“我是一个不好的人”分开，这给了你试错和恢复的空间。",
      },
    ],
  },
  B: {
    label: "规则警觉型",
    summary:
      "你很会读懂规则和预判反应；这让你周全可靠，也可能让你在做自己的选择前先考虑别人。",
    quote: "首先我是一个人，跟你一样的一个人。",
    quoteSource: "易卜生《玩偶之家》",
    quoteNote: "娜拉的离开不是鼓励用决裂证明自由，而是提醒人先成为关系中的主体。你要练习的不是立刻反抗，而是让自己的意愿先拥有一个可以被听见的位置。",
    coreRule: "先看清规则、避免让重要的人失望，关系才比较安全。",
    strength: "你对气氛、责任与风险十分敏锐，常能提前发现问题并把事情稳稳完成。",
    cost: "你可能把选择变成汇报，把分歧体验成伤害，久而久之很难确认自己真正想要什么。",
    trigger: "重要他人的失望、语气变化、追问理由或替你做决定，容易迅速拉高警觉。",
    accent: "bg-amber-600",
    softAccent:
      "bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100",
    scenes: [
      {
        label: "在亲密里",
        title: "你会先判断对方能否接受真实的你",
        body: "表达偏好前，你可能先观察语气和脸色；一旦预感对方不高兴，就容易解释、妥协或暂时收回选择。",
      },
      {
        label: "在冲突里",
        title: "愤怒与内疚常常同时出现",
        body: "你一方面想守住自主，另一方面又担心自己太自私，于是可能在服从、辩解和突然反抗之间摇摆。",
      },
      {
        label: "面对自己",
        title: "你容易用“应该”代替“想要”",
        body: "做决定时，你擅长列出正确答案，却可能要到疲惫或委屈累积后，才发现自己的意愿一直没有被询问。",
      },
    ],
  },
  C: {
    label: "表现换取型",
    summary:
      "你很会察觉期待并做到足够好；这让你容易获得认可，也可能让休息和真实偏好变得有负担。",
    quote: "在隆冬，我终于知道，我身上有一个不可战胜的夏天。",
    quoteSource: "阿尔贝·加缪《重返蒂巴萨》",
    quoteNote: "加缪写的是一种不依赖外部天气的内在生命。对你来说，真正的松动不是停止努力，而是不再用每一次表现证明自己足够好、足够值得被爱。",
    coreRule: "足够好、足够有用、足够懂事，才更容易被看见和留下。",
    strength: "你善于理解期待、兑现承诺和持续进步，往往是别人眼中可靠又体面的人。",
    cost: "当价值感长期依赖表现，休息会带来负罪感，认可也只能短暂止渴。",
    trigger: "比较、评价、公开失败或重要他人撤回肯定，容易让你迅速进入证明模式。",
    accent: "bg-violet-600",
    softAccent:
      "bg-violet-50 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100",
    scenes: [
      {
        label: "在亲密里",
        title: "你习惯成为值得被爱的人",
        body: "你可能通过照顾、解决问题和保持优秀来维系关系，却不一定习惯让对方看见疲惫、普通和无能为力的部分。",
      },
      {
        label: "在冲突里",
        title: "你会先检查自己哪里做得不够好",
        body: "即使责任并不全在你，你也容易立刻修正、补偿或加倍努力，以便尽快恢复对方的认可。",
      },
      {
        label: "面对自己",
        title: "完成一个目标后，标准很快又被抬高",
        body: "你可能很难真正抵达“已经够了”，因为成绩证明的是这一次表现，而不是稳定的自我价值。",
      },
    ],
  },
  D: {
    label: "独自承担型",
    summary:
      "你很能独自消化情绪和解决问题；这份独立保护过你，也可能让表达需要和接受帮助变得陌生。",
    quote: "唯有联结。",
    quoteSource: "E. M. 福斯特《霍华德庄园》",
    quoteNote: "这句“Only connect”不是要求毫无边界地靠近，而是邀请理性、感受与他人重新发生联系。对你来说，重新连接可以从一次很小、很具体的请求开始。",
    coreRule: "把需要收回去、把事情自己处理好，比期待别人回应更稳妥。",
    strength: "你有很强的独立性、耐受力和内在空间，在缺少支持时也能维持生活运转。",
    cost: "别人可能误以为你不需要关心，而你在真正耗尽前，也很难让人知道发生了什么。",
    trigger: "被忽视、求助落空、脆弱被轻描淡写，容易让你立刻撤回需要并关闭连接。",
    accent: "bg-cyan-600",
    softAccent:
      "bg-cyan-50 text-cyan-950 dark:bg-cyan-950/40 dark:text-cyan-100",
    scenes: [
      {
        label: "在亲密里",
        title: "你渴望被理解，却不轻易交出需要",
        body: "你可能更习惯陪伴别人，而不是成为被照顾的人；关系一旦靠得太近，也可能本能地退回自己的空间。",
      },
      {
        label: "在冲突里",
        title: "沉默和撤退比争论更熟悉",
        body: "当表达似乎没有用，你会减少解释、降低期待，用情感断开来避免再次失望。",
      },
      {
        label: "面对自己",
        title: "你常在很晚的时候才承认自己累了",
        body: "你擅长继续运转，却可能忽略身体和情绪已经发出的信号，直到独处也无法恢复。",
      },
    ],
  },
};

const focusCopy: Record<
  ReflectionFocus,
  { label: string; insight: string; action: string }
> = {
  parents: {
    label: "和父母的互动",
    insight: "有些强烈反应可能在回应过去的家庭场景，而不完全是眼前这一次互动。",
    action: "下次和家人互动后，记下一句：这次我是在回应当下，还是在回应过去？",
  },
  relationships: {
    label: "亲密关系",
    insight: "靠近、退后、讨好、控制或沉默，常常都在保护一个没有被说出来的需要。",
    action: "当你想撤退或过度迎合时，先问自己：我真正害怕失去什么？",
  },
  self_worth: {
    label: "自我价值",
    insight: "被爱、被看见和表现得好，可能在你的经验里靠得很近，需要被慢慢分开。",
    action: "今天留出一段不产出的时间，不用证明它有用，也不用事后补偿。",
  },
  boundaries: {
    label: "边界与控制",
    insight: "你可能会先接住别人的情绪和期待，等到很累之后才发现自己的边界。",
    action: "本周找一个低风险请求，练习说：我需要想一下，晚点回复你。",
  },
  emotion: {
    label: "情绪表达",
    insight: "习惯自己消化并不等于没有需要，它可能只是你最熟练的安全方式。",
    action: "向一个相对安全的人提出一个很小的请求，留意收到回应时身体有什么变化。",
  },
};

const practiceByType: Record<string, string[]> = {
  A: ["表达一次不舒服，不急着先维持和谐。", "先理解对方的保护方式，再决定自己的边界。"],
  B: ["做一个低风险决定，暂时不解释理由。", "把“这是关心”和“这是控制”分成两列记录。"],
  C: ["收到肯定时只说谢谢，不立刻补充自己的不足。", "安排一段不产出的休息，不用事后补偿。"],
  D: ["当你想说“没事”时，多说半句真实感受。", "向安全的人提出一个很小、很具体的请求。"],
};

function ReportSection({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Number(index) * 0.04 }}
      className="mb-16"
    >
      <div className="mb-7 flex items-start gap-4">
        <span className="pt-1 text-xs font-semibold text-zinc-400">{index}</span>
        <div>
          <p className="mb-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-bold leading-8">{title}</h2>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

export function ResultShell({
  result,
  testSlug,
  testName,
  focus,
  onRetake,
  shareUrl,
}: ResultShellProps) {
  const meta = result.metadata as unknown as NarrativeMeta;
  const report = typeReports[meta.primaryType] || typeReports.A;
  const focusInfo = focus ? focusCopy[focus] : undefined;
  const practices = practiceByType[meta.primaryType] || practiceByType.A;
  const primaryAction = focusInfo?.action || meta.developmentalTask;

  const handleShare = async () => {
    const url =
      shareUrl === undefined
        ? `${window.location.origin}/result/${testSlug}`
        : shareUrl;
    const text = `我的家庭关系脚本偏向：${report.label}。${report.summary}`;

    if (navigator.share) {
      await navigator.share({
        title: `${testName} - 关系脚本地图`,
        text,
        ...(url ? { url } : {}),
      });
      return;
    }

    const shareText = url ? `${text} ${url}` : text;
    try {
      await navigator.clipboard.writeText(shareText);
      alert(url ? "结果链接已复制到剪贴板" : "结果摘要已复制到剪贴板");
    } catch {
      alert(shareText);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <article className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-16">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-16"
        >
          <blockquote className="mb-10 max-w-2xl border-l-2 border-zinc-300 pl-5 dark:border-zinc-700">
            <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-200">
              “{report.quote}”
            </p>
            <cite className="mt-2 block text-sm not-italic text-zinc-500 dark:text-zinc-400">
              {report.quoteSource}
            </cite>
            <p className="mt-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {report.quoteNote}
            </p>
          </blockquote>

          <div className="mb-5 flex items-center gap-3">
            <span className={`h-2.5 w-2.5 ${report.accent}`} />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              你的主要关系脚本
            </p>
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            {report.label}
          </h1>
          {meta.isMixedMode && meta.mixedArchetypes && (
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              这是一个混合结果，同时带有
              {meta.mixedArchetypes
                .filter((type) => type !== meta.primaryType)
                .map((type) => typeReports[type]?.label || type)
                .join("、")}
              的特征。
            </p>
          )}
          <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-700 dark:text-zinc-200">
            {report.summary}
          </p>

        </motion.header>

        <ReportSection index="01" eyebrow="核心判断" title="这套模式如何保护你，又如何限制你">
          <div className="mb-8 border-y border-zinc-200 py-6 dark:border-zinc-800">
            <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              你较早学会的关系规则
            </p>
            <p className="text-lg font-semibold leading-8">{report.coreRule}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["它给你的能力", report.strength],
              ["它让你付出的代价", report.cost],
              ["最容易触发它的时刻", report.trigger],
            ].map(([label, text]) => (
              <div
                key={label}
                className="border-t border-zinc-200 pt-4 dark:border-zinc-800 md:border-l md:border-t-0 md:px-5 md:pt-0 first:md:border-l-0 first:md:pl-0 last:md:pr-0"
              >
                <h3 className="mb-2 text-sm font-semibold">{label}</h3>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection index="02" eyebrow="现实映射" title="它可能出现在这些关系时刻">
          <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {report.scenes.map((scene) => (
              <div
                key={scene.label}
                className="grid gap-3 py-6 md:grid-cols-[7rem_13rem_1fr] md:gap-6"
              >
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {scene.label}
                </p>
                <h3 className="text-sm font-semibold leading-6">{scene.title}</h3>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {scene.body}
                </p>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection index="03" eyebrow="计算依据" title="这个结果是怎样得出的">
          <ResultEvidence
            dimensions={result.dimensions}
            threeAxes={meta.threeAxes}
            keyInfluences={meta.keyInfluences}
            archetypeRatios={meta.archetypeRatios}
            typeLabels={Object.fromEntries(
              Object.entries(typeReports).map(([key, value]) => [key, value.label])
            )}
            isMixedMode={meta.isMixedMode}
          />
        </ReportSection>

        <ReportSection index="04" eyebrow="自动反应" title="关系如何一步步走进熟悉的循环">
          <p className="mb-6 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            循环不是命运。它只是大脑在不确定时优先调用的旧路径；看清从哪一步开始，才有机会在那里加入新的选择。
          </p>
          <CCRTCycle
            wish={meta.ccrt.wish}
            responseOfOther={meta.ccrt.responseOfOther}
            responseOfSelf={meta.ccrt.responseOfSelf}
            consequence={meta.ccrt.consequence}
          />
        </ReportSection>

        <ReportSection index="05" eyebrow="行动建议" title="先不要改变全部，只练习一个新选择">
          <div className={`p-6 md:p-8 ${report.softAccent}`}>
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={18} aria-hidden="true" />
              <p className="text-sm font-semibold">
                {focusInfo ? `针对你关心的「${focusInfo.label}」` : "本周优先行动"}
              </p>
            </div>
            {focusInfo && (
              <p className="mb-5 max-w-2xl text-sm leading-6 opacity-80">
                {focusInfo.insight}
              </p>
            )}
            <div className="mb-6 grid gap-5 border-y border-current/15 py-5 md:grid-cols-[8rem_1fr]">
              <p className="text-xs font-semibold opacity-70">旧规则</p>
              <p className="text-sm leading-6">{meta.fixationPoint}</p>
              <p className="text-xs font-semibold opacity-70">新的选择</p>
              <p className="text-lg font-bold leading-8">{primaryAction}</p>
            </div>
            <p className="mb-3 text-xs font-semibold opacity-70">完成后再试</p>
            <div className="grid gap-3 md:grid-cols-2">
              {practices.map((practice) => (
                <div key={practice} className="flex items-start gap-2 text-sm leading-6">
                  <ArrowRight size={15} className="mt-1 shrink-0" aria-hidden="true" />
                  <span>{practice}</span>
                </div>
              ))}
            </div>
          </div>
        </ReportSection>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="flex flex-col gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:flex-row"
        >
          <button
            onClick={handleShare}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 bg-zinc-950 px-5 py-3 font-medium text-white transition-opacity hover:opacity-85 dark:bg-zinc-100 dark:text-zinc-950"
          >
            <Share2 size={18} aria-hidden="true" />
            分享结果
          </button>
          <button
            onClick={onRetake}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 border border-zinc-300 px-5 py-3 font-medium transition-colors hover:border-zinc-950 dark:border-zinc-700 dark:hover:border-zinc-100"
          >
            <RefreshCw size={18} aria-hidden="true" />
            重新测试
          </button>
        </motion.div>
      </article>
    </main>
  );
}
