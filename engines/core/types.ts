import { ComponentType } from "react";

// ─────────────────────────────────────
// 题目系统
// ─────────────────────────────────────

export type QuestionType = "single" | "likert" | "multiple";

export interface Option {
  label: string;
  value: string;
  /** 计分权重映射：{ 维度名: 权重值 } */
  weights?: Record<string, number>;
  /** 关联的原型/类型标签 */
  archetype?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: Option[];
  /** 维度映射标签（由具体测试定义） */
  dimension?: string;
}

// ─────────────────────────────────────
// 用户答案
// ─────────────────────────────────────

export interface Answer {
  questionId: string;
  selectedOption: Option;
}

// ─────────────────────────────────────
// 维度得分
// ─────────────────────────────────────

export interface DimensionScore {
  name: string;
  /** 左端标签 */
  leftLabel: string;
  /** 右端标签 */
  rightLabel: string;
  leftScore: number;
  rightScore: number;
  /** 偏向百分比（0-100），用于可视化 */
  percentage: number;
  /** 分级：高/中/低 */
  level?: "high" | "mid" | "low";
  /** 该维度的最大可能得分 */
  maxScore?: number;
}

// ─────────────────────────────────────
// 统一结果结构
// ─────────────────────────────────────

export interface ScoreResult {
  /** 主要类型/原型代码，如 "INTJ", "5w4", "A" */
  primaryType: string;
  /** 维度得分数组 */
  dimensions: DimensionScore[];
  /** 子维度/辅助得分 */
  subScores?: Record<string, number>;
  /** 百分位排名（0-100） */
  percentile?: number;
  /** 测试特定的扩展元数据 */
  metadata?: Record<string, unknown>;
}

// ─────────────────────────────────────
// 结果描述
// ─────────────────────────────────────

export interface ResultDescription {
  type: string;
  title: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  relationships: string;
  /** 颜色主题（用于结果页视觉区分） */
  themeColor?: string;
  /** 图标/emoji */
  icon?: string;
}

// ─────────────────────────────────────
// 计分器接口
// ─────────────────────────────────────

export interface Scorer {
  /** 计算得分，返回统一结果结构 */
  score(answers: Answer[]): ScoreResult;
}

// ─────────────────────────────────────
// 测试注册配置
// ─────────────────────────────────────

export interface TestDefinition {
  /** URL slug，如 "mbti", "enneagram", "big-five", "family-origin" */
  slug: string;
  /** 显示名称 */
  name: string;
  description: string;
  /** Lucide 图标名 */
  icon: string;
  version: string;
  /** 预计用时，如 "10 分钟" */
  estimatedTime: string;
  /** 题目总数 */
  questionCount: number;
  /** 题目类型 */
  questionType: QuestionType;

  /** 加载题目（支持异步/懒加载） */
  getQuestions: () => Question[] | Promise<Question[]>;

  /** 计分器实例 */
  scorer: Scorer;

  /** 根据类型代码获取结果描述 */
  getResultDescription: (type: string) => ResultDescription;

  /** 可选：自定义结果页渲染组件（覆盖默认） */
  resultRenderer?: ComponentType<{ result: ScoreResult }>;

  /** 可选：自定义题目卡片组件（覆盖默认） */
  questionRenderer?: ComponentType<{
    question: Question;
    onAnswer: (option: Option) => void;
    questionNumber: number;
    totalQuestions: number;
  }>;
}

// ─────────────────────────────────────
// 测试注册表
// ─────────────────────────────────────

export class TestRegistry {
  private tests = new Map<string, TestDefinition>();

  register(def: TestDefinition): void {
    if (this.tests.has(def.slug)) {
      throw new Error(`Test "${def.slug}" already registered`);
    }
    this.tests.set(def.slug, def);
  }

  get(slug: string): TestDefinition | undefined {
    return this.tests.get(slug);
  }

  list(): TestDefinition[] {
    return Array.from(this.tests.values());
  }

  has(slug: string): boolean {
    return this.tests.has(slug);
  }
}
