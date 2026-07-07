import {
  createNvidiaClient,
  getNvidiaModelPreference,
} from "@/lib/ai/assistant-config";
import {
  buildChatMessages,
  buildPlanChatMessages,
} from "@/lib/ai/providers/messages";
import type {
  AssistantCompletionInput,
  AssistantProviderId,
  AssistantTextInput,
} from "@/lib/ai/providers/types";
import type OpenAI from "openai";

type NvidiaStreamParams =
  OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming & {
    extra_body?: {
      chat_template_kwargs?: { thinking?: boolean };
    };
  };

type NvidiaCompletionParams =
  OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming & {
    extra_body?: {
      chat_template_kwargs?: { thinking?: boolean };
    };
  };

function buildNvidiaStreamParams(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): NvidiaStreamParams {
  return {
    model: getNvidiaModelPreference(),
    messages,
    temperature: 0.4,
    top_p: 0.95,
    max_tokens: 1600,
    stream: true,
    extra_body: {
      chat_template_kwargs: {
        thinking: false,
      },
    },
  };
}

function buildNvidiaCompletionParams(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: { maxTokens: number; temperature: number },
): NvidiaCompletionParams {
  return {
    model: getNvidiaModelPreference(),
    messages,
    temperature: options.temperature,
    top_p: 0.95,
    max_tokens: options.maxTokens,
    stream: false,
    extra_body: {
      chat_template_kwargs: {
        thinking: false,
      },
    },
  };
}

export async function* streamNvidiaDeepSeekProvider(
  input: AssistantCompletionInput,
): AsyncGenerator<string, void, undefined> {
  const client = createNvidiaClient();
  const stream = await client.chat.completions.create(
    buildNvidiaStreamParams(
      buildChatMessages(input.mode, input.message, input.history),
    ),
  );

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;

    if (delta) {
      yield delta;
    }
  }
}

export async function completeNvidiaDeepSeekProvider(
  input: AssistantCompletionInput,
): Promise<string> {
  const client = createNvidiaClient();
  const response = await client.chat.completions.create(
    buildNvidiaCompletionParams(
      buildChatMessages(input.mode, input.message, input.history),
      { maxTokens: 1600, temperature: 0.4 },
    ),
  );

  const text = response.choices[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("NVIDIA DeepSeek returned an empty response.");
  }

  return text;
}

export async function completeNvidiaDeepSeekText(
  input: AssistantTextInput,
): Promise<string> {
  const client = createNvidiaClient();
  const response = await client.chat.completions.create(
    buildNvidiaCompletionParams(buildPlanChatMessages(input.instructions, input.prompt), {
      maxTokens: input.maxTokens ?? 700,
      temperature: input.temperature ?? 0.35,
    }),
  );

  const text = response.choices[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("NVIDIA DeepSeek returned an empty response.");
  }

  return text;
}

export const nvidiaDeepSeekProviderId: AssistantProviderId = "nvidia-deepseek";
