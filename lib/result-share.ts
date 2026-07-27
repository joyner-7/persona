import type { ReflectionFocus } from "@/store/testStore";

export interface SharedAnswer {
  questionId: string;
  optionValue: string;
}

export interface SharedResultSnapshot {
  version: 1;
  focus?: ReflectionFocus;
  answers: SharedAnswer[];
}

const validFocuses: ReflectionFocus[] = [
  "parents",
  "relationships",
  "self_worth",
  "boundaries",
  "emotion",
];

export function createSharedResultSnapshot(
  answers: Array<{ questionId: string; selectedOption: { value: string } }>,
  focus?: ReflectionFocus
): SharedResultSnapshot {
  return {
    version: 1,
    focus,
    answers: answers.map((answer) => ({
      questionId: answer.questionId,
      optionValue: answer.selectedOption.value,
    })),
  };
}

export function serializeSharedResultSnapshot(
  snapshot: SharedResultSnapshot
): string {
  return JSON.stringify(snapshot);
}

export function parseSharedResultSnapshot(
  raw: string | null | undefined
): SharedResultSnapshot | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<SharedResultSnapshot>;

    if (parsed.version !== 1 || !Array.isArray(parsed.answers)) {
      return null;
    }

    const answers = parsed.answers
      .filter(
        (answer): answer is SharedAnswer =>
          !!answer &&
          typeof answer.questionId === "string" &&
          typeof answer.optionValue === "string"
      )
      .map((answer) => ({
        questionId: answer.questionId,
        optionValue: answer.optionValue,
      }));

    const focus = validFocuses.includes(parsed.focus as ReflectionFocus)
      ? (parsed.focus as ReflectionFocus)
      : undefined;

    return {
      version: 1,
      focus,
      answers,
    };
  } catch {
    return null;
  }
}

export function buildSharedResultUrl(
  origin: string,
  slug: string,
  snapshot: SharedResultSnapshot
): string {
  const params = new URLSearchParams();
  params.set("snapshot", serializeSharedResultSnapshot(snapshot));
  return `${origin}/result/${slug}?${params.toString()}`;
}
