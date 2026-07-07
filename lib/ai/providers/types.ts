import type { AssistantMode } from "@/lib/ai/types";

export type AssistantProviderId = "openai" | "nvidia-deepseek";

export type AssistantSource = AssistantProviderId | "unconfigured";

export interface AssistantHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantStreamChunk {
  delta: string;
  source?: AssistantSource;
}

export interface AssistantReplyResult {
  reply: string;
  source: AssistantSource;
}

export interface AssistantCompletionInput {
  mode: AssistantMode;
  message: string;
  history: AssistantHistoryMessage[];
}

export interface AssistantTextInput {
  instructions: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}
