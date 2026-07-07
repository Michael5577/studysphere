import {
  resolveProviderOrder,
} from "@/lib/ai/assistant-config";
import { getAssistantUnavailableReply } from "@/lib/ai/unavailable";
import {
  completeOpenAIProvider,
  completeOpenAIText,
  streamOpenAIProvider,
} from "@/lib/ai/providers/openai-provider";
import {
  completeNvidiaDeepSeekProvider,
  completeNvidiaDeepSeekText,
  nvidiaDeepSeekProviderId,
  streamNvidiaDeepSeekProvider,
} from "@/lib/ai/providers/nvidia-deepseek-provider";
import type {
  AssistantCompletionInput,
  AssistantProviderId,
  AssistantReplyResult,
  AssistantSource,
  AssistantTextInput,
} from "@/lib/ai/providers/types";

async function* streamWithProvider(
  provider: AssistantProviderId,
  input: AssistantCompletionInput,
): AsyncGenerator<string, void, undefined> {
  if (provider === nvidiaDeepSeekProviderId) {
    yield* streamNvidiaDeepSeekProvider(input);
    return;
  }

  yield* streamOpenAIProvider(input);
}

async function completeWithProvider(
  provider: AssistantProviderId,
  input: AssistantCompletionInput,
): Promise<string> {
  if (provider === nvidiaDeepSeekProviderId) {
    return completeNvidiaDeepSeekProvider(input);
  }

  return completeOpenAIProvider(input);
}

async function completeTextWithProvider(
  provider: AssistantProviderId,
  input: AssistantTextInput,
): Promise<string> {
  if (provider === nvidiaDeepSeekProviderId) {
    return completeNvidiaDeepSeekText(input);
  }

  return completeOpenAIText(input);
}

export async function* streamAssistantReply(
  input: AssistantCompletionInput,
): AsyncGenerator<{ delta: string; source: AssistantSource }, void, undefined> {
  const providers = resolveProviderOrder();

  if (providers.length === 0) {
    const reply = getAssistantUnavailableReply();
    yield { delta: reply, source: "unconfigured" };
    return;
  }

  let lastError: unknown;

  for (const provider of providers) {
    try {
      let started = false;

      for await (const delta of streamWithProvider(provider, input)) {
        if (!started) {
          started = true;
        }

        yield { delta, source: provider };
      }

      if (started) {
        return;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("All AI providers failed.");
}

export async function generateAssistantReply(
  input: AssistantCompletionInput,
): Promise<AssistantReplyResult> {
  const providers = resolveProviderOrder();

  if (providers.length === 0) {
    return {
      reply: getAssistantUnavailableReply(),
      source: "unconfigured",
    };
  }

  let lastError: unknown;

  for (const provider of providers) {
    try {
      const reply = await completeWithProvider(provider, input);

      return {
        reply,
        source: provider,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("All AI providers failed.");
}

export async function generateAssistantText(
  input: AssistantTextInput,
): Promise<{ text: string; source: AssistantSource }> {
  const providers = resolveProviderOrder();

  if (providers.length === 0) {
    throw new Error("No AI provider configured.");
  }

  let lastError: unknown;

  for (const provider of providers) {
    try {
      const text = await completeTextWithProvider(provider, input);
      return { text, source: provider };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("All AI providers failed.");
}

export { isAssistantLive, getPrimaryProviderLabel } from "@/lib/ai/assistant-config";
