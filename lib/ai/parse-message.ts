const STRIP_PREFIX =
  /^(please\s+)?(explain|describe|what is|what are|tell me about|help me (understand|with)|summarize|summary of|create flashcards for|generate flashcards for|make flashcards for|quiz me on)\s+/i;

const VAGUE_ONLY =
  /^(explain( this( concept)?)?|help me|summarize( my notes)?|generate flashcards|hi|hello|hey|thanks|thank you|ok|okay|yes|no|tell me|explain to me)\.?$/i;

export function isVagueMessage(message: string): boolean {
  const trimmed = message.trim();

  if (trimmed.length < 4) {
    return true;
  }

  return VAGUE_ONLY.test(trimmed);
}

export function extractTopic(message: string): string | null {
  const trimmed = message.trim();

  if (isVagueMessage(trimmed)) {
    return null;
  }

  let topic = trimmed.replace(STRIP_PREFIX, "").trim();
  topic = topic.replace(/[?.!]+$/, "").trim();

  if (topic.length < 3 || /^(this|it|that|me|notes|my notes)$/i.test(topic)) {
    return null;
  }

  return topic;
}

export function normalizeForMatch(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function messageMatches(message: string, keywords: string[]): boolean {
  const normalized = normalizeForMatch(message);

  return keywords.some((keyword) => normalized.includes(keyword));
}
