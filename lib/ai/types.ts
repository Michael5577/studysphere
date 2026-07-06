export const ASSISTANT_MODES = ["chat", "summarize", "flashcards", "quiz"] as const;

export type AssistantMode = (typeof ASSISTANT_MODES)[number];

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  error?: boolean;
}

export const ASSISTANT_MODE_LABELS: Record<AssistantMode, string> = {
  chat: "Chat",
  summarize: "Summarize",
  flashcards: "Cards",
  quiz: "Quiz",
};

export const EXAMPLE_PROMPTS: Record<AssistantMode, readonly string[]> = {
  chat: [
    "Explain database indexes in simple terms",
    "Help me understand recursion with an example",
    "How should I plan a 2-hour study session for my midterm?",
  ],
  summarize: [
    "Summarize: photosynthesis converts light energy into chemical energy stored in glucose",
  ],
  flashcards: [
    "Generate flashcards for binary search trees",
  ],
  quiz: [
    "Quiz me on the basics of object-oriented programming",
  ],
};
