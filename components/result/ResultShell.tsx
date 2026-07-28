"use client";

import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Share2, Sparkles } from "lucide-react";
import { ScoreResult } from "@/engines/core/types";
import type { ReflectionFocus } from "@/store/testStore";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
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
  cycleOpening: string;
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
    cycleOpening:
      "当你急着解释、协调，想让关系尽快回到平静时，先停一停，问问自己：我是在照顾彼此，还是也需要让自己的不舒服被听见？",
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
    strength: "你对气氛、责任与风险十分敏锐，常常能提前发现问题并妥善解决。",
    cost: "你可能常常需要解释自己的选择，也容易把分歧听成否定，久了就不太确定自己真正想要什么。",
    trigger: "当重要的人流露失望、语气改变、追问理由或替你做决定时，你往往会很快进入警觉状态。",
    cycleOpening:
      "当你发现自己又在解释、妥协，或把感受收起来时，不妨先停一停，问问自己：我是真的同意，还是只是不想让对方失望？",
    scenes: [
      {
        label: "在亲密里",
        title: "你会先判断对方能否接受真实的你",
        body: "表达偏好前，你可能会先观察语气和脸色；一旦预感对方不高兴，就容易解释、妥协或暂时收回选择。",
      },
      {
        label: "在冲突里",
        title: "愤怒与内疚常常同时出现",
        body: "你一方面想守住自我，另一方面又担心自己太自私，于是可能在服从、辩解和突然反抗之间摇摆。",
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
    quoteNote: "加缪写的是一种不被外界境遇左右的内在生命。对你来说，真正的松动并不是停止努力，而是不再把每一次表现，都当作证明自己足够好、值得被爱的机会。",
    coreRule: "足够好、足够有用、足够懂事，才更容易被看见和留下。",
    strength: "你善于理解期待、兑现承诺和持续进步，往往是别人眼中可靠又体面的人。",
    cost: "当价值感总要靠表现来支撑，休息会变得像亏欠，认可也只能短暂地让人安心。",
    trigger: "比较、评价、公开受挫，或重要的人不再给予肯定时，你很容易进入想要证明自己的状态。",
    cycleOpening:
      "当你又想立刻补偿、加倍努力，或用结果扳回认可时，先停一停，问问自己：我是在回应真正的需要，还是在用表现换取安心？",
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
        body: "你可能很难真正相信自己已经够好了，因为成绩能证明的只是这一次表现，而不是你本身的价值。",
      },
    ],
  },
  D: {
    label: "独自承担型",
    summary:
      "你很能独自消化情绪和解决问题；这份独立保护过你，也可能让表达需要和接受帮助变得陌生。",
    quote: "唯有联结。",
    quoteSource: "E. M. 福斯特《霍华德庄园》",
    quoteNote: "‘唯有联结’ 不是要求你毫无边界地靠近谁，而是提醒你，让理性、感受和人与人之间的联系重新流动起来。对你来说，可以先从提出一个小而具体的请求开始。",
    coreRule: "把需要收回去、把事情自己处理好，比期待别人回应更稳妥。",
    strength: "你有很强的独立性、耐受力和内在空间，在缺少支持时也能维持生活运转。",
    cost: "别人可能误以为你不需要关心，而你在真正耗尽前，也很难让人知道发生了什么。",
    trigger: "被忽视、求助落空、脆弱被轻描淡写，容易让你立刻撤回需要并关闭连接。",
    cycleOpening:
      "当你想说“没事”、自己处理，或突然把人推远时，先停一停，问问自己：我是真的需要一点空间，还是害怕开口后得不到回应？",
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Number(index) * 0.03 }}
      className={cn(ui.section, "border-t border-divider first:border-t-0")}
    >
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-4">
          <span className={ui.sectionIndex}>{index}</span>
          <span className={ui.label}>{eyebrow}</span>
        </div>
        <h2 className={ui.h2}>{title}</h2>
      </header>
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
    <main className={ui.page}>
      <article className={cn(ui.container, "py-12 md:py-16 lg:py-20 prose-magazine")}>
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-16 flex flex-col text-center md:mb-20"
        >
          <div className="mb-10 flex items-center justify-between">
            <span className={ui.label}>Persona</span>
            <span className={ui.label}>No. 20 / 20</span>
          </div>

          <p className={cn(ui.bodySm, "mb-4")}>你的家庭关系脚本是</p>
          <h1 className={cn(ui.h1, "mb-8")}>{report.label}</h1>
          <p className={cn(ui.body, "mx-auto max-w-lg text-text-sub")}>
            {report.summary}
          </p>

          <blockquote className={cn(ui.blockquote, "mx-auto mt-12 max-w-lg text-left")}>
            <p className={ui.blockquoteText}>「{report.quote}」</p>
            <cite className={ui.blockquoteCite}>{report.quoteSource}</cite>
          </blockquote>
        </motion.header>

        <ReportSection index="01" eyebrow="关系画像" title="你不是被定义，而是在熟悉中保护自己">
          <article className="space-y-8">
            <blockquote className={ui.blockquote}>
              <p className={ui.blockquoteText}>
                「婴儿与照顾者之间的情感纽带，不只关乎温暖，更关乎生存。人会用一生去找回最初那种被稳稳接住的感觉。」
              </p>
              <cite className={ui.blockquoteCite}>——约翰·鲍尔比《安全基地》</cite>
            </blockquote>
            <p className={ui.body}>
              鲍尔比提醒我们：每一种保护自己的方式，最初都是为了活下去。下面的规则曾经帮你获得过安全，现在的问题是——它是否还在帮你获得你真正需要的东西？
            </p>
            <div className={cn(ui.divider, "pt-0")}>
              <p className={cn(ui.label, "mb-3 normal-case tracking-normal")}>
                你较早学会的关系规则
              </p>
              <p className={cn(ui.h3, "leading-[1.9]")}>{report.coreRule}</p>
            </div>
            <dl className="space-y-6">
              {[
                ["它给你的能力", report.strength],
                ["它让你付出的代价", report.cost],
                ["最容易触发它的时刻", report.trigger],
              ].map(([label, text]) => (
                <div key={label}>
                  <dt className={cn(ui.label, "mb-2 normal-case tracking-normal")}>
                    {label}
                  </dt>
                  <dd className={ui.bodySm}>{text}</dd>
                </div>
              ))}
            </dl>
          </article>
        </ReportSection>

        <ReportSection index="02" eyebrow="关系侧写" title="它如何出现在你的关系里">
          <article className="space-y-8">
            <blockquote className={ui.blockquote}>
              <p className={ui.blockquoteText}>
                「孩子不是在完美的环境中长大，而是在被理解的环境中长大。那些没有被说出口的需要，最终会变成身体语言和行为模式。」
              </p>
              <cite className={ui.blockquoteCite}>——唐纳德·温尼科特《抱持与解释》</cite>
            </blockquote>
            <p className={ui.body}>
              温尼科特说的「身体语言」，就是你无意识中在每种关系里重复的脚本。看看下面这些场景——哪一个你最熟悉？
            </p>
            <div className="space-y-8">
              {report.scenes.map((scene) => (
                <div key={scene.label} className={cn(ui.cardStatic, "p-6")}>
                  <h3 className={cn(ui.h3, "mb-3")}>
                    {scene.label}，{scene.title}
                  </h3>
                  <p className={ui.bodySm}>{scene.body}</p>
                </div>
              ))}
            </div>
          </article>
        </ReportSection>

        <ReportSection index="03" eyebrow="关系坐标" title="此刻最值得留意的几个方向">
          <blockquote className={cn(ui.blockquote, "mb-8")}>
            <p className={ui.blockquoteText}>
              「认识你自己的阴影，不是为了消灭它，而是为了不再被它无声地支配。类型不是囚笼，而是理解自己的第一张地图。」
            </p>
            <cite className={ui.blockquoteCite}>——卡尔·荣格《心理类型》</cite>
          </blockquote>
          <p className={cn(ui.bodySm, "mb-10")}>
            分数不是判断，而是理解关系反应的几个坐标。雷达图和下方卡片完整呈现这次答题的六项维度。
          </p>
          <ResultEvidence dimensions={result.dimensions} />
        </ReportSection>

        <ReportSection index="04" eyebrow="关系循环" title="关系如何走进熟悉的循环">
          <p className={cn(ui.bodySm, "mb-10")}>
            这套反应曾是你适应关系的一种方式。如今，它也许会在不确定时带你回到熟悉的旧路；而看清它从哪里开始，就是为自己打开新选择的第一步。
          </p>
          <CCRTCycle
            wish={meta.ccrt.wish}
            responseOfOther={meta.ccrt.responseOfOther}
            responseOfSelf={meta.ccrt.responseOfSelf}
            consequence={meta.ccrt.consequence}
          />
          <div className={cn(ui.blockquote, "mt-10")}>
            <p className={cn(ui.label, "mb-3 normal-case tracking-normal text-text-sub")}>
              循环最早开始松动的地方
            </p>
            <p className={ui.bodySm}>{report.cycleOpening}</p>
          </div>
        </ReportSection>

        <ReportSection index="05" eyebrow="关系处方" title="先练习一个新的选择">
          <blockquote className={cn(ui.blockquote, "mb-8")}>
            <p className={ui.blockquoteText}>
              「重要的不是被给予了什么，而是如何利用被给予的东西。每一种『不幸』的脚本背后，都潜藏着一个更自由的选择——哪怕它只有一根头发丝那么细。」
            </p>
            <cite className={ui.blockquoteCite}>——阿尔弗雷德·阿德勒《自卑与超越》</cite>
          </blockquote>
          <p className={cn(ui.bodySm, "mb-10")}>
            阿德勒这句话的意思是：过去发生的事情你无法改变，但你可以选择现在怎么用它。
            <span className="text-text">下面这个练习只要求你做一件事</span>
            ——在面对那个熟悉的时刻时，给自己一个旧模式之外的新选项。不是推翻自己，只是加一个岔路。
          </p>
          <div className={cn(ui.cardStatic, "border-accent/20 p-6 md:p-8")}>
            <div className="mb-6 flex items-center gap-3">
              <Sparkles size={18} className="text-accent" strokeWidth={1.5} aria-hidden="true" />
              <p className={cn(ui.h3, "text-base")}>
                {focusInfo ? `这一周，先留意「${focusInfo.label}」` : "这一周，先留意这个"}
              </p>
            </div>
            {focusInfo && (
              <p className={cn(ui.bodySm, "mb-8")}>{focusInfo.insight}</p>
            )}
            <div className="mb-8 border-y border-divider py-8">
              <p className={cn(ui.label, "mb-3 normal-case tracking-normal")}>
                你一直在用的那条路
              </p>
              <p className={cn(ui.bodySm, "mb-8")}>{meta.fixationPoint}</p>
              <p className={cn(ui.label, "mb-3 normal-case tracking-normal")}>
                这周试着走另一条
              </p>
              <p className={cn(ui.h3, "leading-[1.9] text-text")}>{primaryAction}</p>
            </div>
            <p className={cn(ui.label, "mb-4 normal-case tracking-normal")}>
              如果还有力气折腾
            </p>
            <div className="space-y-4">
              {practices.map((practice) => (
                <div key={practice} className="flex items-start gap-3">
                  <ArrowRight
                    size={18}
                    className="mt-1 shrink-0 text-accent"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className={ui.bodySm}>{practice}</span>
                </div>
              ))}
            </div>
          </div>
        </ReportSection>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(ui.divider, "flex flex-col gap-4 sm:flex-row")}
        >
          <button onClick={handleShare} className={cn(ui.btnPrimary, "flex-1")}>
            <Share2 size={18} strokeWidth={1.5} aria-hidden="true" />
            分享结果
          </button>
          <button onClick={onRetake} className={cn(ui.btnSecondary, "flex-1")}>
            <RefreshCw size={18} strokeWidth={1.5} aria-hidden="true" />
            重新测试
          </button>
        </motion.div>
      </article>
    </main>
  );
}
