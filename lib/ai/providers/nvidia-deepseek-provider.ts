import {
  buildChatMessages,
  buildPlanChatMessages,
} from "@/lib/ai/providers/messages";
import {
  completeNvidiaChat,
  streamNvidiaChat,
} from "@/lib/ai/providers/nvidia-api";
import type {
  AssistantCompletionInput,
  AssistantProviderId,
  AssistantTextInput,
} from "@/lib/ai/providers/types";

export async function* streamNvidiaDeepSeekProvider(
  input: AssistantCompletionInput,
): AsyncGenerator<string, void, undefined> {
  yield* streamNvidiaChat(
    buildChatMessages(input.mode, input.message, input.history),
    { maxTokens: 4096, temperature: 1 },
  );
}

export async function completeNvidiaDeepSeekProvider(
  input: AssistantCompletionInput,
): Promise<string> {
  return completeNvidiaChat(
    buildChatMessages(input.mode, input.message, input.history),
    { maxTokens: 4096, temperature: 1 },
  );
}

export async function completeNvidiaDeepSeekText(
  input: AssistantTextInput,
): Promise<string> {
  return completeNvidiaChat(
    buildPlanChatMessages(input.instructions, input.prompt),
    {
      maxTokens: input.maxTokens ?? 700,
      temperature: input.temperature ?? 1,
    },
  );
}

export const nvidiaDeepSeekProviderId: AssistantProviderId = "nvidia-deepseek";
