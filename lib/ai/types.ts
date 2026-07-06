export const ASSISTANT_MODES = ["chat", "summarize", "flashcards"] as const;

export type AssistantMode = (typeof ASSISTANT_MODES)[number];

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const ASSISTANT_MODE_LABELS: Record<AssistantMode, string> = {
  chat: "Chat",
  summarize: "Summarize",
  flashcards: "Flashcards",
};

export const EXAMPLE_PROMPTS = [
  "Explain database indexes",
  "Summarize: recursion is when a function calls itself to solve smaller subproblems",
  "Generate flashcards for binary search trees",
  "Help me plan a 2-hour study session for my midterm",
] as const;
