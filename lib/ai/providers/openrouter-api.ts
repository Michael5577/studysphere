import {
  getOpenRouterApiKey,
  getOpenRouterModelPreference,
  getOpenRouterSiteUrl,
  OPENROUTER_API_BASE_URL,
} from "@/lib/ai/assistant-config";
import type OpenAI from "openai";

const OPENROUTER_CHAT_URL = `${OPENROUTER_API_BASE_URL}/chat/completions`;
const REQUEST_TIMEOUT_MS = 90_000;

export class OpenRouterApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "OpenRouterApiError";
    this.status = status;
  }
}

interface OpenRouterChatRequest {
  model: string;
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  temperature: number;
  max_tokens: number;
  stream: boolean;
}

function buildOpenRouterPayload(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: { maxTokens: number; temperature: number; stream: boolean },
): OpenRouterChatRequest {
  return {
    model: getOpenRouterModelPreference(),
    messages,
    temperature: options.temperature,
    max_tokens: options.maxTokens,
    stream: options.stream,
  };
}

async function readOpenRouterError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: { message?: string } | string;
      message?: string;
    };

    if (typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }

    if (typeof body.error === "string" && body.error.trim()) {
      return body.error;
    }

    if (
      body.error &&
      typeof body.error === "object" &&
      typeof body.error.message === "string" &&
      body.error.message.trim()
    ) {
      return body.error.message;
    }
  } catch {
    // Fall through to status text.
  }

  return response.statusText || "OpenRouter request failed.";
}

function openRouterHeaders(stream: boolean): HeadersInit {
  const apiKey = getOpenRouterApiKey();

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: stream ? "text/event-stream" : "application/json",
    "HTTP-Referer": getOpenRouterSiteUrl(),
    "X-Title": "StudySphere",
  };
}

async function postOpenRouterChat(
  payload: OpenRouterChatRequest,
): Promise<Response> {
  const response = await fetch(OPENROUTER_CHAT_URL, {
    method: "POST",
    headers: openRouterHeaders(payload.stream),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const message = await readOpenRouterError(response);
    console.error("[openrouter-api] request failed", {
      status: response.status,
      message,
    });
    throw new OpenRouterApiError(response.status, message);
  }

  return response;
}

function extractStreamDelta(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const choices = (payload as { choices?: unknown }).choices;

  if (!Array.isArray(choices) || choices.length === 0) {
    return undefined;
  }

  const delta = (
    choices[0] as {
      delta?: {
        content?: unknown;
        reasoning_content?: unknown;
        reasoning?: unknown;
      };
    }
  ).delta;

  if (!delta) {
    return undefined;
  }

  // Tutor UX: show the answer only, not chain-of-thought tokens.
  if (typeof delta.content === "string" && delta.content) {
    return delta.content;
  }

  return undefined;
}

export async function* streamOpenRouterChat(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: { maxTokens?: number; temperature?: number } = {},
): AsyncGenerator<string, void, undefined> {
  const response = await postOpenRouterChat(
    buildOpenRouterPayload(messages, {
      maxTokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.7,
      stream: true,
    }),
  );

  if (!response.body) {
    throw new Error("OpenRouter returned an empty streaming response.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let yielded = false;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed.startsWith("data:")) {
          continue;
        }

        const data = trimmed.slice(5).trim();

        if (!data || data === "[DONE]") {
          continue;
        }

        try {
          const delta = extractStreamDelta(JSON.parse(data));

          if (delta) {
            yielded = true;
            yield delta;
          }
        } catch {
          // Ignore malformed SSE chunks.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (!yielded) {
    throw new Error("OpenRouter returned an empty response.");
  }
}

export async function completeOpenRouterChat(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: { maxTokens?: number; temperature?: number } = {},
): Promise<string> {
  const response = await postOpenRouterChat(
    buildOpenRouterPayload(messages, {
      maxTokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.7,
      stream: false,
    }),
  );

  const body = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const text = body.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return text;
}
