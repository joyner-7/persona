import { Answer, DimensionScore, Scorer, ScoreResult } from "@/engines/core/types";
import {
  dimensionLabels,
  maxScores,
  interpretationThresholds,
  ccrts,
  defenses,
  fixations,
} from "./results";

export interface NarrativeMeta {
  primaryType: string;
  archetypeRatios: Record<string, number>;
  isMixedMode: boolean;
  mixedArchetypes?: string[];
  dimensionLevels: Record<string, "high" | "mid" | "low">;
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
  defenseLevel: "mature" | "neurotic" | "immature";
  defenseMechanisms: string[];
  fixationPoint: string;
  developmentalTask: string;
  keyInfluences: {
    dimension: string;
    score: number;
    impact: string;
  }[];
}

export class FamilyOriginScorer implements Scorer {
  score(answers: Answer[]): ScoreResult {
    const totalQuestions = 20;

    const dimensionSums: Record<string, number> = {
      emotional_warmth: 0,
      security_base: 0,
      control_intensity: 0,
      conditional_love: 0,
      boundary_intrusion: 0,
      emotional_neglect: 0,
    };

    const archetypeCounts: Record<string, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    answers.forEach((ans) => {
      const w = ans.selectedOption.weights || {};
      Object.entries(w).forEach(([dim, weight]) => {
        dimensionSums[dim] = (dimensionSums[dim] || 0) + weight;
      });

      const arch = ans.selectedOption.archetype;
      if (arch) {
        archetypeCounts[arch] = (archetypeCounts[arch] || 0) + 1;
      }
    });

    const dimensions: DimensionScore[] = Object.entries(dimensionSums).map(
      ([name, sum]) => {
        const max = maxScores[name] || 1;
        const pct = Math.round((sum / max) * 100);
        const info = dimensionLabels[name];
        const thr = interpretationThresholds[name];

        let level: "high" | "mid" | "low" = "mid";
        if (pct >= thr.high) level = "high";
        else if (pct < thr.mid) level = "low";

        return {
          name,
          leftLabel: info?.label || name,
          rightLabel: "",
          leftScore: 0,
          rightScore: sum,
          percentage: pct,
          level,
          maxScore: max,
        };
      }
    );

    const archetypeRatios: Record<string, number> = {};
    Object.entries(archetypeCounts).forEach(([arch, count]) => {
      archetypeRatios[arch] = Math.round((count / totalQuestions) * 100);
    });

    const sortedArchetypes = Object.entries(archetypeRatios).sort(
      (a, b) => b[1] - a[1]
    );

    const primaryType = sortedArchetypes[0][0];
    const secondType = sortedArchetypes[1];

    const isMixedMode =
      secondType && secondType[1] >= sortedArchetypes[0][1] * 0.7;

    const dimensionLevels: Record<string, "high" | "mid" | "low"> = {};
    dimensions.forEach((d) => {
      dimensionLevels[d.name] = d.level || "mid";
    });

    const dimMap = Object.fromEntries(
      dimensions.map((d) => [d.name, d.percentage])
    );

    const ew = dimMap.emotional_warmth;
    const ci = dimMap.control_intensity;
    const cl = dimMap.conditional_love;
    const bi = dimMap.boundary_intrusion;
    const en = dimMap.emotional_neglect;

    const threeAxes = {
      warmth: Math.round((ew + (100 - en)) / 2),
      control: Math.round((ci + cl + bi) / 3),
      neglect: en,
    };

    const ccrt = this.resolveCCRT(primaryType, dimensionLevels, dimMap);

    const { defenseLevel, defenseMechanisms } = this.resolveDefense(
      primaryType,
      dimensionLevels,
      dimMap
    );

    const { fixationPoint, developmentalTask } = this.resolveFixation(
      primaryType,
      dimensionLevels
    );

    const keyInfluences = this.resolveKeyInfluences(dimensions);

    const metadata: NarrativeMeta = {
      primaryType,
      archetypeRatios,
      isMixedMode,
      mixedArchetypes: isMixedMode
        ? [sortedArchetypes[0][0], secondType[0]]
        : undefined,
      dimensionLevels,
      threeAxes,
      ccrt,
      defenseLevel,
      defenseMechanisms,
      fixationPoint,
      developmentalTask,
      keyInfluences,
    };

    return {
      primaryType,
      dimensions,
      subScores: archetypeRatios,
      metadata: metadata as unknown as Record<string, unknown>,
    };
  }

  private resolveCCRT(
    type: string,
    levels: Record<string, "high" | "mid" | "low">,
    dimMap: Record<string, number>
  ) {
    const candidate = ccrts[type];
    if (!candidate) return ccrts.A;

    if (
      type === "B" &&
      levels.control_intensity === "high" &&
      levels.emotional_warmth === "low"
    ) {
      return {
        wish: "希望能按照自己的想法生活，而不被过度干涉",
        responseOfOther: "对方继续施加控制或表现出失望",
        responseOfSelf: "感到窒息、愤怒但又内疚，最终压抑自己",
        consequence: "关系表面和谐但内心疏离，自我价值感持续降低",
      };
    }

    if (
      type === "C" &&
      levels.conditional_love === "high" &&
      dimMap.conditional_love > 70
    ) {
      return {
        wish: "希望被无条件地爱和接纳",
        responseOfOther: "对方的爱仍与表现挂钩，优秀才被关注",
        responseOfSelf: "不断追求卓越，但内心空虚，害怕失败",
        consequence: "活在条件交换的循环中，难以体验被无条件接纳的感受",
      };
    }

    return candidate;
  }

  private resolveDefense(
    type: string,
    levels: Record<string, "high" | "mid" | "low">,
    dimMap: Record<string, number>
  ) {
    let level: "mature" | "neurotic" | "immature" = "mature";
    const mechanisms: string[] = [];

    if (type === "A") {
      level = "mature";
      mechanisms.push("升华", "幽默", "利他");
      if (levels.boundary_intrusion === "high") {
        mechanisms.push("压抑");
      }
    } else if (type === "B") {
      level = "neurotic";
      mechanisms.push("理智化", "反向形成", "隔离");
      if (levels.control_intensity === "high") {
        mechanisms.push("投射", "替代");
      }
    } else if (type === "C") {
      level = "neurotic";
      mechanisms.push("压抑", "合理化", "抵消");
      if (dimMap.conditional_love > 75) {
        mechanisms.push("过度补偿", "否认");
      }
    } else if (type === "D") {
      level = "immature";
      mechanisms.push("否认", "分裂", "投射性认同");
      if (levels.emotional_neglect === "high") {
        mechanisms.push("退行", "解离");
      }
    }

    if (this.isMixedType(type, levels)) {
      level = "neurotic";
      mechanisms.push("压抑", "理智化");
    }

    const def = defenses[level];
    return {
      defenseLevel: level,
      defenseMechanisms: mechanisms.length > 0 ? mechanisms : def.mechanisms,
    };
  }

  private resolveFixation(
    type: string,
    levels: Record<string, "high" | "mid" | "low">
  ) {
    const fixation = fixations[type] || fixations.A;

    if (
      type === "B" &&
      levels.control_intensity === "high" &&
      levels.emotional_warmth === "low"
    ) {
      return {
        fixationPoint: "爱常常和控制、担心、服从缠在一起",
        developmentalTask: "从一个低风险决定开始，练习区分爱、担心和控制",
      };
    }

    if (type === "C" && levels.conditional_love === "high") {
      return {
        fixationPoint: "被看见常常需要通过表现来交换",
        developmentalTask: "把自我价值从外部成就里慢慢松开，练习无绩效的休息",
      };
    }

    if (type === "D" && levels.emotional_neglect === "high") {
      return {
        fixationPoint: "需要别人可能曾经不安全，独自承担更可控",
        developmentalTask: "从很小的请求开始，练习接受关怀而不急着撤回",
      };
    }

    return fixation;
  }

  private resolveKeyInfluences(
    dimensions: DimensionScore[]
  ): { dimension: string; score: number; impact: string }[] {
    const impacts: Record<
      string,
      Record<"high" | "mid" | "low", string>
    > = {
      emotional_warmth: {
        high: "你学会了信任情感连接，能在关系中感到安全",
        mid: "你对情感连接有渴望但也有犹豫，常在亲近与疏离间摆动",
        low: "你可能习惯了情感自给自足，难以相信他人会真正回应你",
      },
      security_base: {
        high: "家庭为你提供了稳定的探索基地，你敢于冒险",
        mid: "你在熟悉的环境中感到安全，但面对未知时容易焦虑",
        low: "你习惯了不稳定的环境，可能过度警觉或提前放弃",
      },
      control_intensity: {
        high: "过度控制让你学会了察言观色，但也压抑了自主性",
        mid: "你对规则敏感，在约束中寻找自己的空间",
        low: "你有较高的自主性，但也可能缺乏必要的结构感",
      },
      conditional_love: {
        high: "你内化了表现等于价值的信念，容易自我苛求",
        mid: "你希望得到认可，但也在学习不被评价左右",
        low: "你较少被条件束缚，能更自由地做自己",
      },
      boundary_intrusion: {
        high: "你的个人空间常被侵犯，学会了模糊自己的边界",
        mid: "你在亲密与独立之间寻找平衡",
        low: "你的边界相对清晰，能较好地维护自我空间",
      },
      emotional_neglect: {
        high: "长期被忽视让你学会了压抑需求，难以表达脆弱",
        mid: "你有时感到不被理解，但也在学习自我关怀",
        low: "你的情感需求曾被较好地回应，能自如地表达感受",
      },
    };

    return dimensions
      .filter((d) => d.level !== "mid")
      .sort((a, b) => {
        const severity = (d: DimensionScore) => {
          const info = dimensionLabels[d.name];
          if (info?.type === "positive" && d.level === "low") {
            return 100 - d.percentage;
          }
          return d.percentage;
        };
        return severity(b) - severity(a);
      })
      .slice(0, 3)
      .map((d) => ({
        dimension: d.name,
        score: d.percentage,
        impact: impacts[d.name]?.[d.level || "mid"] || "",
      }));
  }

  private isMixedType(
    type: string,
    levels: Record<string, "high" | "mid" | "low">
  ) {
    const negativeHigh = [
      levels.control_intensity,
      levels.conditional_love,
      levels.boundary_intrusion,
      levels.emotional_neglect,
    ].filter((l) => l === "high").length;
    return negativeHigh >= 2 && type !== "A";
  }
}
