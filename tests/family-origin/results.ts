import { ResultDescription } from "@/engines/core/types";

export const resultDescriptions: Record<string, ResultDescription> = {
  A: {
    type: "A",
    title: "安全基地型",
    summary:
      "你较容易把关系体验为可依靠的地方，也比较能在亲近和独立之间移动。",
    strengths: [
      "能够建立健康的亲密关系",
      "对自我有相对稳定的认知",
      "在压力下有较好的情绪调节能力",
      "既能独立也能依赖他人",
    ],
    weaknesses: [
      "可能低估他人的情感创伤",
      "面对冲突时有时过于乐观",
      "可能难以理解极端控制或忽视的家庭动态",
    ],
    careers: [
      "稳定协作",
      "照顾与支持",
      "关系修复",
      "长期陪伴",
    ],
    relationships:
      "你在关系中倾向于提供安全感，能够接纳伴侣的脆弱，同时保持自己的边界。",
    themeColor: "#4ade80",
    icon: "🏡",
  },
  B: {
    type: "B",
    title: "控制渗透型",
    summary:
      "你可能很早学会观察规则、预判反应，也因此对自主选择和犯错更敏感。",
    strengths: [
      "对规则和结构高度敏感",
      "执行力强，善于完成任务",
      "在高压环境下能保持产出",
      "对细节和秩序有天然的优势",
    ],
    weaknesses: [
      "容易焦虑和自我批评",
      "难以放松和接纳不完美",
      "可能在关系中重复控制或被控制的模式",
      "自主决策时感到困难",
    ],
    careers: [
      "规则梳理",
      "风险预判",
      "细节把关",
      "高压执行",
    ],
    relationships:
      "你可能在关系中倾向于控制或被控制，需要学习在亲密中保持独立。",
    themeColor: "#f97316",
    icon: "🔒",
  },
  C: {
    type: "C",
    title: "条件交换型",
    summary:
      "你可能很擅长读懂期待并表现得体，同时也容易把被爱和表现绑定在一起。",
    strengths: [
      "追求卓越，自我驱动力强",
      "善于读懂他人期待并满足",
      "在社交场合表现得体",
      "适应能力强，能快速调整行为",
    ],
    weaknesses: [
      "自我价值感高度依赖外部评价",
      "容易 burnout，难以休息",
      "真实需求被长期压抑",
      "害怕失败，完美主义倾向",
    ],
    careers: [
      "目标推进",
      "表达呈现",
      "社交适配",
      "标准提升",
    ],
    relationships:
      "你可能在关系中倾向于「表现」而非「存在」，需要学习被爱的权利不需要通过成就来证明。",
    themeColor: "#8b5cf6",
    icon: "🎭",
  },
  D: {
    type: "D",
    title: "情感荒漠型",
    summary:
      "你可能习惯先靠自己消化一切，独立是保护，也是你重新学习连接的起点。",
    strengths: [
      "极强的独立性和自给自足能力",
      "情绪耐受力高，能独自面对困难",
      "对他人的痛苦有深刻的同理心",
      "创造力往往源于内心的丰富世界",
    ],
    weaknesses: [
      "难以信任他人，难以求助",
      "在亲密关系中感到不适或逃避",
      "可能压抑情感需求，导致身心问题",
      "容易陷入孤独或疏离感",
    ],
    careers: [
      "独立思考",
      "深度创作",
      "安静观察",
      "自我修复",
    ],
    relationships:
      "你可能在关系中既渴望亲密又害怕受伤，需要学习允许自己被需要，也允许自己去需要别人。",
    themeColor: "#06b6d4",
    icon: "🌵",
  },
};

export const ccrts: Record<
  string,
  {
    wish: string;
    responseOfOther: string;
    responseOfSelf: string;
    consequence: string;
  }
> = {
  A: {
    wish: "希望能保持亲密的连接，同时拥有独立的空间",
    responseOfOther: "对方通常能回应你的需求，关系相对稳定",
    responseOfSelf: "你感到被理解和支持，能够自如地表达情感",
    consequence: "建立了健康互惠的关系模式，既能亲密又能独立",
  },
  B: {
    wish: "希望能按照自己的意愿生活，获得真正的自主",
    responseOfOther: "对方可能继续施加控制或表现出失望",
    responseOfSelf: "你感到压抑、愤怒但又内疚，最终选择顺从或反抗",
    consequence: "在亲密与自主之间挣扎，难以找到平衡点",
  },
  C: {
    wish: "希望能被无条件地爱和接纳，而不需要证明什么",
    responseOfOther: "对方的爱仍与你的表现挂钩，优秀才被关注",
    responseOfSelf: "你不断追求卓越，但内心空虚，害怕失败",
    consequence: "活在成就驱动的循环中，难以体验「存在」的价值",
  },
  D: {
    wish: "希望能被真正看见和回应，不再独自面对世界",
    responseOfOther: "对方可能忽视或无法理解你的情感需求",
    responseOfSelf: "你学会压抑需求，表现得不需要任何人",
    consequence: "形成假性独立，内心深处却渴望连接",
  },
};

export const defenses: Record<
  string,
  {
    level: string;
    description: string;
    mechanisms: string[];
  }
> = {
  mature: {
    level: "灵活保护",
    description:
      "你比较能在需要、边界和现实之间来回调整，保护方式具有弹性。",
    mechanisms: ["升华", "幽默", "理智化", "利他", "压抑（适度）"],
  },
  neurotic: {
    level: "紧绷保护",
    description:
      "你会用一些很努力、很消耗的方式保护自己。它们曾经有用，但现在可能让你难以放松。",
    mechanisms: [
      "压抑",
      "反向形成",
      "隔离",
      "理智化（过度）",
      "替代",
      "合理化",
    ],
  },
  immature: {
    level: "强力保护",
    description:
      "你可能发展出更强硬的自我保护方式，先确保不再受伤，再慢慢考虑靠近别人。",
    mechanisms: [
      "否认",
      "投射",
      "分裂",
      "投射性认同",
      "退行",
      "解离",
    ],
  },
};

export const fixations: Record<
  string,
  {
    fixationPoint: string;
    developmentalTask: string;
  }
> = {
  A: {
    fixationPoint: "关系可以同时容纳亲近和独立",
    developmentalTask: "继续保持真实表达，也练习理解别人不一样的关系脚本",
  },
  B: {
    fixationPoint: "爱常常和控制、担心、服从缠在一起",
    developmentalTask:
      "从一个低风险决定开始，练习先确认自己的意愿，再决定要不要解释",
  },
  C: {
    fixationPoint: "被看见常常需要通过表现来交换",
    developmentalTask:
      "每天记录一件没有产出但让你舒服的小事，练习把存在感从表现里松开",
  },
  D: {
    fixationPoint: "需要别人可能曾经不安全，独自承担更可控",
    developmentalTask:
      "向一个相对安全的人提出一个很小的请求，观察被回应时身体的反应",
  },
};

export function getResultDescription(type: string): ResultDescription {
  return (
    resultDescriptions[type] || {
      type,
      title: "未知类型",
      summary: "未找到对应的结果描述。",
      strengths: [],
      weaknesses: [],
      careers: [],
      relationships: "",
    }
  );
}

export const dimensionLabels: Record<
  string,
  { label: string; type: "positive" | "negative"; description: string }
> = {
  emotional_warmth: {
    label: "情感温度",
    type: "positive",
    description: "童年时期是否被温暖回应、情感被接住",
  },
  security_base: {
    label: "安全基地",
    type: "positive",
    description: "家庭环境是否稳定、可预期、能作为探索世界的后盾",
  },
  control_intensity: {
    label: "控制强度",
    type: "negative",
    description: "父母是否过度干预、替代决策、要求服从",
  },
  conditional_love: {
    label: "条件化程度",
    type: "negative",
    description: "爱是否建立在表现、成就、听话等条件之上",
  },
  boundary_intrusion: {
    label: "边界侵入",
    type: "negative",
    description: "隐私、情绪、自我空间是否被尊重",
  },
  emotional_neglect: {
    label: "情感忽视",
    type: "negative",
    description: "基本情感需求是否被长期忽略或无人回应",
  },
};

export const maxScores: Record<string, number> = {
  emotional_warmth: 36,
  security_base: 20,
  control_intensity: 25,
  conditional_love: 22,
  boundary_intrusion: 18,
  emotional_neglect: 38,
};

export const interpretationThresholds: Record<
  string,
  { high: number; mid: number; low: number }
> = {
  emotional_warmth: { high: 75, mid: 40, low: 0 },
  security_base: { high: 70, mid: 35, low: 0 },
  control_intensity: { high: 60, mid: 25, low: 0 },
  conditional_love: { high: 60, mid: 25, low: 0 },
  boundary_intrusion: { high: 55, mid: 20, low: 0 },
  emotional_neglect: { high: 65, mid: 30, low: 0 },
};
