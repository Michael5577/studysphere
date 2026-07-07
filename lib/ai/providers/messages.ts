import { getAssistantInstructions } from "@/lib/ai/prompts";
import type { AssistantHistoryMessage } from "@/lib/ai/providers/types";
import type { AssistantMode } from "@/lib/ai/types";
import type OpenAI from "openai";

export function buildResponsesInput(
  message: string,
  history: AssistantHistoryMessage[],
): OpenAI.Responses.ResponseInput {
  const items: OpenAI.Responses.ResponseInput = history.slice(-12).map((item) => ({
    role: item.role,
    content: item.content,
  }));

  items.push({
    role: "user",
    content: message,
  });

  return items;
}

export function buildChatMessages(
  mode: AssistantMode,
  message: string,
  history: AssistantHistoryMessage[],
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: getAssistantInstructions(mode),
    },
    ...history.slice(-12).map((item) => ({
      role: item.role,
      content: item.content,
    })),
    {
      role: "user",
      content: message,
    },
  ];
}

export function buildPlanChatMessages(
  instructions: string,
  prompt: string,
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    { role: "system", content: instructions },
    { role: "user", content: prompt },
  ];
}
