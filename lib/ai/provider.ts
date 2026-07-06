import {
  createOpenAIClient,
  getOpenAIApiKey,
  getOpenAIModelPreference,
  isOpenAIModelUnavailableError,
  OPENAI_FALLBACK_MODEL,
} from "@/lib/ai/openai-config";
import { getAssistantInstructions } from "@/lib/ai/prompts";
import { generateMockAssistantReply } from "@/lib/ai/mock";
import type { AssistantMode } from "@/lib/ai/types";
import type OpenAI from "openai";

export interface AssistantHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

interface GenerateAssistantReplyInput {
  mode: AssistantMode;
  message: string;
  history?: AssistantHistoryMessage[];
}

export interface GenerateAssistantReplyResult {
  reply: string;
  source: "openai" | "fallback";
}

function buildInput(
  message: string,
  history: AssistantHistoryMessage[],
): OpenAI.Responses.ResponseInput {
  const items: OpenAI.Responses.ResponseInput = history.slice(-8).map((item) => ({
    role: item.role,
    content: item.content,
  }));

  items.push({
    role: "user",
    content: message,
  });

  return items;
}

async function callOpenAIResponses(
  mode: AssistantMode,
  message: string,
  history: AssistantHistoryMessage[],
  model: string,
): Promise<string> {
  const client = createOpenAIClient();

  const response = await client.responses.create({
    model,
    instructions: getAssistantInstructions(mode),
    input: buildInput(message, history),
    max_output_tokens: 1200,
    temperature: 0.4,
  });

  const text = response.output_text?.trim();

  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }

  return text;
}

async function callOpenAIWithModelFallback(
  mode: AssistantMode,
  message: string,
  history: AssistantHistoryMessage[],
): Promise<string> {
  const preferredModel = getOpenAIModelPreference();
  const models = [preferredModel];

  if (preferredModel !== OPENAI_FALLBACK_MODEL) {
    models.push(OPENAI_FALLBACK_MODEL);
  }

  let lastError: unknown;

  for (const model of models) {
    try {
      return await callOpenAIResponses(mode, message, history, model);
    } catch (error) {
      lastError = error;

      if (!isOpenAIModelUnavailableError(error)) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("No OpenAI model available.");
}

export async function generateAssistantReply(
  input: GenerateAssistantReplyInput,
): Promise<GenerateAssistantReplyResult> {
  const history = input.history ?? [];

  if (!getOpenAIApiKey()) {
    return {
      reply: generateMockAssistantReply(input.mode, input.message),
      source: "fallback",
    };
  }

  const reply = await callOpenAIWithModelFallback(
    input.mode,
    input.message,
    history,
  );

  return {
    reply,
    source: "openai",
  };
}

export { isAssistantLive, getOpenAIErrorMessage } from "@/lib/ai/openai-config";
