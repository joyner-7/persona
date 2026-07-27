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
      className="border-t border-zinc-200 py-9 first:border-t-0 dark:border-zinc-800"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="text-xs font-medium tracking-[0.16em] text-zinc-400">
          {index}
        </span>
        <div>
          <p className="mb-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {eyebrow}
          </p>
          <h2 className="text-lg font-semibold leading-7">{title}</h2>
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
      <article className="mx-auto max-w-[42rem] px-6 py-8 sm:px-8 md:py-12">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-col text-center"
        >
          <blockquote className="order-4 mx-auto mt-7 max-w-xl py-5">
            <p className="text-base leading-7 text-zinc-700 dark:text-zinc-200">
              “{report.quote}”
            </p>
            <cite className="mt-2 block text-xs not-italic text-zinc-500 dark:text-zinc-400">
              {report.quoteSource}
            </cite>
          </blockquote>

          <div className="order-1 mb-7 flex items-center justify-between text-[10px] font-medium tracking-[0.18em] text-zinc-400">
            <span>PERSONA</span>
            <span>NO. 20 / 20</span>
          </div>
          <div className="order-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              你的家庭关系脚本是
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
              {report.label}
            </h1>

          </div>
          <p className="order-3 mx-auto mt-6 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            {report.summary}
          </p>
        </motion.header>

        <ReportSection index="01" eyebrow="关系画像" title="你不是被定义，而是在熟悉中保护自己">
          <article className="space-y-5">
            <blockquote className="border-l-2 border-zinc-300 pl-4 dark:border-zinc-700">
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                “婴儿与照顾者之间的情感纽带，不只关乎温暖，更关乎生存。人会用一生去找回最初那种被稳稳接住的感觉。”
              </p>
              <cite className="mt-2 block text-xs not-italic text-zinc-500 dark:text-zinc-400">
                ——约翰·鲍尔比《安全基地》
              </cite>
            </blockquote>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              鲍尔比提醒我们：每一种保护自己的方式，最初都是为了活下去。下面的规则曾经帮你获得过安全，现在的问题是——它是否还在帮你获得你真正需要的东西？
            </p>
            <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
              <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                你较早学会的关系规则
              </p>
              <p className="text-lg font-semibold leading-8">{report.coreRule}</p>
            </div>
            <dl className="space-y-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              {[
                ["它给你的能力", report.strength],
                ["它让你付出的代价", report.cost],
                ["最容易触发它的时刻", report.trigger],
              ].map(([label, text]) => (
                <div key={label}>
                  <dt className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {label}
                  </dt>
                  <dd className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {text}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </ReportSection>

        <ReportSection index="02" eyebrow="关系侧写" title="它如何出现在你的关系里">
          <article className="space-y-5">
            <blockquote className="border-l-2 border-zinc-300 pl-4 dark:border-zinc-700">
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                “孩子不是在完美的环境中长大，而是在被理解的环境中长大。那些没有被说出口的需要，最终会变成身体语言和行为模式。”
              </p>
              <cite className="mt-2 block text-xs not-italic text-zinc-500 dark:text-zinc-400">
                ——唐纳德·温尼科特《抱持与解释》
              </cite>
            </blockquote>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              温尼科特说的“身体语言”，就是你无意识中在每种关系里重复的脚本。看看下面这些场景——哪一个你最熟悉？
            </p>
            <div className="space-y-5 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              {report.scenes.map((scene) => (
                <div key={scene.label}>
                  <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {scene.label}
                  </p>
                  <h3 className="mb-1 text-sm font-semibold">{scene.title}</h3>
                  <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {scene.body}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </ReportSection>

        <ReportSection index="03" eyebrow="关系坐标" title="此刻最值得留意的几个方向">
          <blockquote className="mb-8 max-w-2xl border-l-2 border-zinc-300 pl-5 dark:border-zinc-700">
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              “认识你自己的阴影，不是为了消灭它，而是为了不再被它无声地支配。类型不是囚笼，而是理解自己的第一张地图。”
            </p>
            <cite className="mt-1 block text-sm not-italic text-zinc-500">
              ——卡尔·荣格《心理类型》
            </cite>
          </blockquote>
          <p className="mb-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            分数不是判断，而是理解关系反应的几个坐标。雷达图和下方卡片完整呈现这次答题的六项维度。
          </p>
          <ResultEvidence
            dimensions={result.dimensions}
          />
        </ReportSection>

        <ReportSection index="04" eyebrow="待定" title="关系如何走进熟悉的循环">
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

        <ReportSection index="05" eyebrow="关系处方" title="先练习一个新的选择">
          <blockquote className="mb-8 max-w-2xl border-l-2 border-zinc-300 pl-5 dark:border-zinc-700">
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              “重要的不是被给予了什么，而是如何利用被给予的东西。每一种‘不幸’的脚本背后，都潜藏着一个更自由的选择——哪怕它只有一根头发丝那么细。”
            </p>
            <cite className="mt-1 block text-sm not-italic text-zinc-500">
              ——阿尔弗雷德·阿德勒《自卑与超越》
            </cite>
          </blockquote>
          <p className="mb-6 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            阿德勒这句话的意思是：过去发生的事情你无法改变，但你可以选择现在怎么用它。<strong>下面这个练习只要求你做一件事</strong>——在面对那个熟悉的时刻时，给自己一个旧模式之外的新选项。不是推翻自己，只是加一个岔路。
          </p>
          <div className={`border border-current/15 p-5 md:p-6 ${report.softAccent}`}>
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={18} aria-hidden="true" />
              <p className="text-sm font-semibold">
                {focusInfo ? `这一周，先留意「${focusInfo.label}」` : "这一周，先留意这个"}
              </p>
            </div>
            {focusInfo && (
              <p className="mb-5 max-w-2xl text-sm leading-6 opacity-80">
                {focusInfo.insight}
              </p>
            )}
            <div className="mb-6 border-y border-current/15 py-5">
              <p className="mb-2 text-xs font-semibold opacity-70">你一直在用的那条路</p>
              <p className="mb-5 text-sm leading-6">{meta.fixationPoint}</p>
              <p className="mb-2 text-xs font-semibold opacity-70">这周试着走另一条</p>
              <p className="text-lg font-bold leading-8">{primaryAction}</p>
            </div>
            <p className="mb-3 text-xs font-semibold opacity-70">如果还有力气折腾</p>
            <div className="space-y-3">
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
          className="mt-2 flex flex-col gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:flex-row"
        >
          <button
            onClick={handleShare}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 border border-zinc-950 bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
          >
            <Share2 size={18} aria-hidden="true" />
            分享结果
          </button>
          <button
            onClick={onRetake}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 border border-zinc-300 px-5 py-3 text-sm font-medium transition-colors hover:border-zinc-950 dark:border-zinc-700 dark:hover:border-zinc-100"
          >
            <RefreshCw size={18} aria-hidden="true" />
            重新测试
          </button>
        </motion.div>
      </article>
    </main>
  );
}
