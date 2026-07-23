import { TestDefinition } from "@/engines/core/types";
import { getQuestions } from "./questions";
import { FamilyOriginScorer } from "./scorer";
import { getResultDescription } from "./results";

export const familyOriginTest: TestDefinition = {
  slug: "family-origin",
  name: "家庭关系脚本测试",
  description:
    "通过 20 个关系场景，理解你从家庭经验中习得的亲密、自主、价值感和边界模式。",
  icon: "Home",
  version: "1.0.0",
  estimatedTime: "8 分钟",
  questionCount: 20,
  questionType: "single",
  getQuestions,
  scorer: new FamilyOriginScorer(),
  getResultDescription,
};
