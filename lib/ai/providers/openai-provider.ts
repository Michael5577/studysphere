import {
  createOpenAIClient,
  getOpenAIModelPreference,
  isOpenAIModelUnavailableError,
  OPENAI_FALLBACK_MODEL,
} from "@/lib/ai/assistant-config";
import { getAssistantInstructions } from "@/lib/ai/prompts";
import { buildResponsesInput } from "@/lib/ai/providers/messages";
import type {
  AssistantCompletionInput,
  AssistantProviderId,
  AssistantTextInput,
} from "@/lib/ai/providers/types";

function buildRequestParams(
  mode: AssistantCompletionInput["mode"],
  message: string,
  history: AssistantCompletionInput["history"],
  model: string,
) {
  return {
    model,
    instructions: getAssistantInstructions(mode),
    input: buildResponsesInput(message, history),
    max_output_tokens: 1600,
    temperature: 0.4,
  } as const;
}

async function completeOpenAI(
  input: AssistantCompletionInput,
  model: string,
): Promise<string> {
  const client = createOpenAIClient();

  const response = await client.responses.create({
    ...buildRequestParams(input.mode, input.message, input.history, model),
    stream: false,
  });

  const text = response.output_text?.trim();

  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }

  return text;
}

export async function* streamOpenAIProvider(
  input: AssistantCompletionInput,
): AsyncGenerator<string, void, undefined> {
  const preferredModel = getOpenAIModelPreference();
  const models = [preferredModel];

  if (preferredModel !== OPENAI_FALLBACK_MODEL) {
    models.push(OPENAI_FALLBACK_MODEL);
  }

  let lastError: unknown;

  for (const model of models) {
    try {
      const client = createOpenAIClient();
      const stream = await client.responses.create({
        ...buildRequestParams(input.mode, input.message, input.history, model),
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === "response.output_text.delta" && event.delta) {
          yield event.delta;
        }
      }

      return;
    } catch (error) {
      lastError = error;

      if (!isOpenAIModelUnavailableError(error)) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("No OpenAI model available.");
}

export async function completeOpenAIProvider(
  input: AssistantCompletionInput,
): Promise<string> {
  const preferredModel = getOpenAIModelPreference();
  const models = [preferredModel];

  if (preferredModel !== OPENAI_FALLBACK_MODEL) {
    models.push(OPENAI_FALLBACK_MODEL);
  }

  let lastError: unknown;

  for (const model of models) {
    try {
      return await completeOpenAI(input, model);
    } catch (error) {
      lastError = error;

      if (!isOpenAIModelUnavailableError(error)) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("No OpenAI model available.");
}

export async function completeOpenAIText(input: AssistantTextInput): Promise<string> {
  const preferredModel = getOpenAIModelPreference();
  const models = [preferredModel];

  if (preferredModel !== OPENAI_FALLBACK_MODEL) {
    models.push(OPENAI_FALLBACK_MODEL);
  }

  const client = createOpenAIClient();
  let lastError: unknown;

  for (const model of models) {
    try {
      const response = await client.responses.create({
        model,
        instructions: input.instructions,
        input: input.prompt,
        max_output_tokens: input.maxTokens ?? 700,
        temperature: input.temperature ?? 0.35,
        stream: false,
      });

      const text = response.output_text?.trim();

      if (!text) {
        throw new Error("OpenAI returned an empty response.");
      }

      return text;
    } catch (error) {
      lastError = error;

      if (!isOpenAIModelUnavailableError(error)) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("No OpenAI model available.");
}

export const openaiProviderId: AssistantProviderId = "openai";
