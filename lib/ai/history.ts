import type { AssistantMode } from "@/lib/ai/types";

export interface AssistantHistoryMessageSnapshot {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantHistoryEntry {
  id: string;
  mode: AssistantMode;
  title: string;
  updatedAt: number;
  messages: AssistantHistoryMessageSnapshot[];
}

const HISTORY_STORAGE_KEY = "studysphere-assistant-history";
const MAX_ENTRIES = 30;

export function readAssistantHistory(): AssistantHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as AssistantHistoryEntry[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (entry) =>
          entry &&
          typeof entry.id === "string" &&
          typeof entry.title === "string" &&
          Array.isArray(entry.messages),
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function writeAssistantHistory(entries: AssistantHistoryEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(entries.slice(0, MAX_ENTRIES)),
    );
  } catch {
    // Storage full or unavailable — history is best-effort.
  }
}

export function upsertAssistantHistoryEntry(entry: AssistantHistoryEntry) {
  const entries = readAssistantHistory().filter((item) => item.id !== entry.id);
  entries.unshift(entry);
  writeAssistantHistory(entries);
}

export function deleteAssistantHistoryEntry(id: string) {
  writeAssistantHistory(readAssistantHistory().filter((item) => item.id !== id));
}

export function clearAssistantHistory() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(HISTORY_STORAGE_KEY);
}
