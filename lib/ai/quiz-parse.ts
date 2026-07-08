export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizPayload {
  questions: QuizQuestion[];
}

function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as QuizQuestion;

  return (
    typeof item.id === "string" &&
    typeof item.prompt === "string" &&
    Array.isArray(item.options) &&
    item.options.length >= 2 &&
    item.options.every((option) => typeof option === "string") &&
    typeof item.correctIndex === "number" &&
    item.correctIndex >= 0 &&
    item.correctIndex < item.options.length
  );
}

function normalizeQuizPayload(value: unknown): QuizPayload | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const questions = (value as { questions?: unknown }).questions;

  if (!Array.isArray(questions) || questions.length === 0) {
    return null;
  }

  const valid = questions.filter(isQuizQuestion);

  if (valid.length === 0) {
    return null;
  }

  return { questions: valid };
}

function extractJsonBlock(content: string): string | null {
  const fenced = content.match(/```(?:json|quiz)?\s*([\s\S]*?)```/i);

  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return content.slice(start, end + 1);
  }

  return null;
}

export function parseQuizPayload(content: string): QuizPayload | null {
  const trimmed = content.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return normalizeQuizPayload(JSON.parse(trimmed));
  } catch {
    // Fall through to block extraction.
  }

  const block = extractJsonBlock(trimmed);

  if (!block) {
    return null;
  }

  try {
    return normalizeQuizPayload(JSON.parse(block));
  } catch {
    return null;
  }
}
