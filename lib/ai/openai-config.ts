import OpenAI from "openai";

export const OPENAI_FALLBACK_MODEL = "gpt-4.1-mini";
export const OPENAI_PREFERRED_MODEL = "gpt-5.5";

export function getOpenAIApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY?.trim() || undefined;
}

export function getOpenAIModelPreference(): string {
  return process.env.OPENAI_MODEL?.trim() || OPENAI_PREFERRED_MODEL;
}

export function isAssistantLive(): boolean {
  return Boolean(getOpenAIApiKey());
}

export function createOpenAIClient(): OpenAI {
  const apiKey = getOpenAIApiKey();

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({ apiKey });
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
      message.includes("model") && message.includes("not")
    );
  }

  return false;
}

export function getOpenAIErrorMessage(error: unknown): string {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return "OpenAI rejected the API key. Check OPENAI_API_KEY in your environment.";
    }

    if (error.status === 429) {
      return "OpenAI rate limit reached. Wait a moment and try again.";
    }

    if (error.status === 400) {
      return "OpenAI could not process that request. Try rephrasing your question.";
    }

    return `OpenAI error (${error.status}): ${error.message}`;
  }

  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.message.includes("timeout")) {
      return "OpenAI took too long to respond. Please try again.";
    }

    return error.message;
  }

  return "Unable to reach OpenAI. Please try again.";
}
