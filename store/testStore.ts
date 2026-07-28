import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Answer } from "@/engines/core/types";

export type ReflectionFocus =
  | "parents"
  | "relationships"
  | "self_worth"
  | "boundaries"
  | "emotion";

export interface TestSession {
  currentQuestionIndex: number;
  answers: Answer[];
  isCompleted: boolean;
  startedAt: number;
  completedAt?: number;
  focus?: ReflectionFocus;
}

interface TestStoreState {
  sessions: Record<string, TestSession>;
  setFocus: (slug: string, focus: ReflectionFocus) => void;
  setAnswer: (slug: string, answer: Answer) => void;
  goBack: (slug: string) => void;
  complete: (slug: string) => void;
  reset: (slug: string) => void;
}

export const useTestStore = create<TestStoreState>()(
  persist(
    (set) => ({
      sessions: {},

      setFocus: (slug: string, focus: ReflectionFocus) => {
        set((state) => {
          const existing = state.sessions[slug];
          const session: TestSession = existing || {
            currentQuestionIndex: 0,
            answers: [],
            isCompleted: false,
            startedAt: Date.now(),
          };
          return {
            sessions: {
              ...state.sessions,
              [slug]: {
                ...session,
                focus,
              },
            },
          };
        });
      },

      setAnswer: (slug: string, answer: Answer) => {
        set((state) => {
          const existing = state.sessions[slug];
          const session: TestSession = existing || {
            currentQuestionIndex: 0,
            answers: [],
            isCompleted: false,
            startedAt: Date.now(),
          };
          const newAnswers = [...session.answers];
          const idx = newAnswers.findIndex(
            (a) => a.questionId === answer.questionId
          );
          if (idx >= 0) {
            newAnswers[idx] = answer;
          } else {
            newAnswers.push(answer);
          }
          return {
            sessions: {
              ...state.sessions,
              [slug]: {
                ...session,
                answers: newAnswers,
                currentQuestionIndex:
                  idx >= 0
                    ? session.currentQuestionIndex
                    : session.currentQuestionIndex + 1,
              },
            },
          };
        });
      },

      goBack: (slug: string) => {
        set((state) => {
          const session = state.sessions[slug];
          if (!session || session.currentQuestionIndex <= 0) return state;
          return {
            sessions: {
              ...state.sessions,
              [slug]: {
                ...session,
                currentQuestionIndex: session.currentQuestionIndex - 1,
              },
            },
          };
        });
      },

      complete: (slug: string) => {
        set((state) => {
          const session = state.sessions[slug];
          if (!session) return state;
          return {
            sessions: {
              ...state.sessions,
              [slug]: {
                ...session,
                isCompleted: true,
                completedAt: Date.now(),
              },
            },
          };
        });
      },

      reset: (slug: string) => {
        set((state) => {
          const sessions = { ...state.sessions };
          delete sessions[slug];
          return { sessions };
        });
      },
    }),
    {
      name: "personality-test-sessions",
    }
  )
);
