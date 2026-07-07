import OpenAI from "openai";

export const OPENAI_FALLBACK_MODEL = "gpt-4.1-mini";
export const OPENAI_PREFERRED_MODEL = "gpt-5.5";

export const NVIDIA_API_BASE_URL = "https://integrate.api.nvidia.com/v1";
export const NVIDIA_DEEPSEEK_MODEL = "deepseek-ai/deepseek-v4-flash";

export type AIProviderPreference = "auto" | "openai" | "nvidia";

export function getOpenAIApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY?.trim() || undefined;
}

export function getNvidiaApiKey(): string | undefined {
  return process.env.NVIDIA_API_KEY?.trim() || undefined;
}

export function getOpenAIModelPreference(): string {
  return process.env.OPENAI_MODEL?.trim() || OPENAI_PREFERRED_MODEL;
}

export function getNvidiaModelPreference(): string {
  return process.env.NVIDIA_MODEL?.trim() || NVIDIA_DEEPSEEK_MODEL;
}

export function getAIProviderPreference(): AIProviderPreference {
  const value = process.env.AI_PROVIDER?.trim().toLowerCase();

  if (value === "openai" || value === "nvidia") {
    return value;
  }

  return "auto";
}

export function isAssistantLive(): boolean {
  return Boolean(getOpenAIApiKey() || getNvidiaApiKey());
}

export function getPrimaryProviderLabel(): string | null {
  const order = resolveProviderOrder();

  if (order.length === 0) {
    return null;
  }

  return order[0];
}

export function resolveProviderOrder(): Array<"openai" | "nvidia-deepseek"> {
  const preference = getAIProviderPreference();
  const hasOpenAI = Boolean(getOpenAIApiKey());
  const hasNvidia = Boolean(getNvidiaApiKey());

  if (preference === "nvidia") {
    return [
      ...(hasNvidia ? (["nvidia-deepseek"] as const) : []),
      ...(hasOpenAI ? (["openai"] as const) : []),
    ];
  }

  if (preference === "openai") {
    return [
      ...(hasOpenAI ? (["openai"] as const) : []),
      ...(hasNvidia ? (["nvidia-deepseek"] as const) : []),
    ];
  }

  return [
    ...(hasNvidia ? (["nvidia-deepseek"] as const) : []),
    ...(hasOpenAI ? (["openai"] as const) : []),
  ];
}

export function createOpenAIClient(): OpenAI {
  const apiKey = getOpenAIApiKey();

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({ apiKey });
}

export function createNvidiaClient(): OpenAI {
  const apiKey = getNvidiaApiKey();

  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey,
    baseURL: NVIDIA_API_BASE_URL,
  });
}

export function isOpenAIModelUnavailableError(error: unknown): boolean {
  if (!(error instanceof OpenAI.APIError)) {
    return false;
  }

  if (error.status === 404) {
    return true;
  }

  if (error.status === 400) {
    const code = (error.error as { code?: string } | undefined)?.code;
    const message = error.message.toLowerCase();

    return (
      code === "model_not_found" ||
      (message.includes("model") && message.includes("not"))
    );
  }

  return false;
}

export function getAIErrorMessage(error: unknown): string {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return "The AI provider rejected the API key. Check your server environment variables.";
    }

    if (error.status === 429) {
      return "AI rate limit reached. Wait a moment and try again.";
    }

    if (error.status === 400) {
      return "The AI provider could not process that request. Try rephrasing your question.";
    }

    return `AI provider error (${error.status}): ${error.message}`;
  }

  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.message.includes("timeout")) {
      return "The AI provider took too long to respond. Please try again.";
    }

    return error.message;
  }

  return "Unable to reach the AI provider. Please try again.";
}

// Backward-compatible export
export const getOpenAIErrorMessage = getAIErrorMessage;
