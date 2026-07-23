import rawData from "./questions.json";
import { Question } from "@/engines/core/types";

const jsonQuestions = rawData.questions as unknown as Array<{
  id: number;
  text: string;
  options: Record<
    string,
    {
      text: string;
      archetype: string;
      dimension_scores: Record<string, number>;
    }
  >;
}>;

const optionRotations = [0, 2, 1, 3, 1, 3, 2, 0, 2, 1];

function rotateOptions<T>(items: T[], questionIndex: number): T[] {
  const rotation = optionRotations[questionIndex % optionRotations.length];
  return [...items.slice(rotation), ...items.slice(0, rotation)];
}

export function getQuestions(): Question[] {
  return jsonQuestions.map((q, index) => {
    const options = Object.entries(q.options).map(([key, opt]) => ({
      label: opt.text,
      value: key,
      weights: opt.dimension_scores,
      archetype: opt.archetype,
    }));

    return {
      id: String(q.id),
      type: "single" as const,
      text: q.text,
      options: rotateOptions(options, index),
    };
  });
}

export const meta = rawData.meta;
export const scoring = rawData.scoring;
