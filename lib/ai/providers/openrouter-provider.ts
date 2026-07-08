import {
  buildChatMessages,
  buildPlanChatMessages,
} from "@/lib/ai/providers/messages";
import {
  completeOpenRouterChat,
  streamOpenRouterChat,
} from "@/lib/ai/providers/openrouter-api";
import type {
  AssistantCompletionInput,
  AssistantProviderId,
  AssistantTextInput,
} from "@/lib/ai/providers/types";

export async function* streamOpenRouterProvider(
  input: AssistantCompletionInput,
): AsyncGenerator<string, void, undefined> {
  yield* streamOpenRouterChat(
    buildChatMessages(input.mode, input.message, input.history),
    { maxTokens: 4096, temperature: 0.7 },
  );
}

export async function completeOpenRouterProvider(
  input: AssistantCompletionInput,
): Promise<string> {
  return completeOpenRouterChat(
    buildChatMessages(input.mode, input.message, input.history),
    { maxTokens: 4096, temperature: 0.7 },
  );
}

export async function completeOpenRouterText(
  input: AssistantTextInput,
): Promise<string> {
  return completeOpenRouterChat(
    buildPlanChatMessages(input.instructions, input.prompt),
    {
      maxTokens: input.maxTokens ?? 700,
      temperature: input.temperature ?? 0.35,
    },
  );
}

export const openRouterProviderId: AssistantProviderId = "openrouter";
