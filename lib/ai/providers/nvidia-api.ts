import {
  getNvidiaApiKey,
  getNvidiaModelPreference,
  NVIDIA_API_BASE_URL,
} from "@/lib/ai/assistant-config";
import type OpenAI from "openai";

const NVIDIA_CHAT_URL = `${NVIDIA_API_BASE_URL}/chat/completions`;
const REQUEST_TIMEOUT_MS = 90_000;

export class NvidiaApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "NvidiaApiError";
    this.status = status;
  }
}

interface NvidiaChatRequest {
  model: string;
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  temperature: number;
  top_p: number;
  max_tokens: number;
  stream: boolean;
  reasoning_effort: "none";
  chat_template_kwargs: {
    thinking: false;
  };
}

function buildNvidiaPayload(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: { maxTokens: number; temperature: number; stream: boolean },
): NvidiaChatRequest {
  return {
    model: getNvidiaModelPreference(),
    messages,
    temperature: options.temperature,
    top_p: 0.95,
    max_tokens: options.maxTokens,
    stream: options.stream,
    reasoning_effort: "none",
    chat_template_kwargs: {
      thinking: false,
    },
  };
}

async function readNvidiaError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      detail?: string;
      message?: string;
      error?: { message?: string } | string;
    };

    if (typeof body.detail === "string" && body.detail.trim()) {
      return body.detail;
    }

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

  return response.statusText || "NVIDIA request failed.";
}

async function postNvidiaChat(
  payload: NvidiaChatRequest,
): Promise<Response> {
  const apiKey = getNvidiaApiKey();

  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured.");
  }

  const response = await fetch(NVIDIA_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: payload.stream ? "text/event-stream" : "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const message = await readNvidiaError(response);
    console.error("[nvidia-api] request failed", {
      status: response.status,
      message,
    });
    throw new NvidiaApiError(response.status, message);
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

  const delta = (choices[0] as { delta?: { content?: unknown } }).delta;

  if (!delta || typeof delta.content !== "string" || !delta.content) {
    return undefined;
  }

  return delta.content;
}

export async function* streamNvidiaChat(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: { maxTokens?: number; temperature?: number } = {},
): AsyncGenerator<string, void, undefined> {
  const response = await postNvidiaChat(
    buildNvidiaPayload(messages, {
      maxTokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 1,
      stream: true,
    }),
  );

  if (!response.body) {
    throw new Error("NVIDIA returned an empty streaming response.");
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
    throw new Error("NVIDIA DeepSeek returned an empty response.");
  }
}

export async function completeNvidiaChat(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: { maxTokens?: number; temperature?: number } = {},
): Promise<string> {
  const response = await postNvidiaChat(
    buildNvidiaPayload(messages, {
      maxTokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 1,
      stream: false,
    }),
  );

  const body = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const text = body.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("NVIDIA DeepSeek returned an empty response.");
  }

  return text;
}
