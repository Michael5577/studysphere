"use client";

import type { AssistantHistoryEntry } from "@/lib/ai/history";
import { ASSISTANT_MODE_LABELS, EXAMPLE_PROMPTS, type AssistantMode } from "@/lib/ai/types";
import { cn } from "@/lib/utils";
import { History, Sparkles } from "lucide-react";

interface AssistantEmptyStateProps {
  mode: AssistantMode;
  historyEntries?: AssistantHistoryEntry[];
  onSelectPrompt: (prompt: string) => void;
  onRestoreHistory?: (id: string) => void;
  disabled?: boolean;
  isOffline?: boolean;
}

function formatHistoryDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function AssistantEmptyState({
  mode,
  historyEntries = [],
  onSelectPrompt,
  onRestoreHistory,
  disabled = false,
  isOffline = false,
}: AssistantEmptyStateProps) {
  const prompts = EXAMPLE_PROMPTS[mode];
  const recent = historyEntries.slice(0, 5);

  return (
    <div className="assistant-empty flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-6 sm:px-4">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-muted text-primary">
          <Sparkles className="h-5 w-5" strokeWidth={1.5} />
        </div>

        <h3 className="font-serif text-xl font-semibold text-text">
          How can I help you study?
        </h3>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
          {isOffline
            ? "Add OPENROUTER_API_KEY (or NVIDIA/OpenAI keys) to enable live AI tutoring."
            : "Explain concepts, summarize notes, build flashcards, or take a practice quiz."}
        </p>

        {recent.length > 0 && onRestoreHistory && (
          <div className="mt-5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <History className="h-3.5 w-3.5" />
              Recent sessions
            </p>
            <div className="flex flex-col gap-2">
              {recent.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onRestoreHistory(entry.id)}
                  className={cn(
                    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-left transition-default focus-ring",
                    "hover:border-primary/30 hover:bg-primary-muted/35 disabled:opacity-50",
                  )}
                >
                  <p className="truncate text-sm font-medium text-text">
                    {entry.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {ASSISTANT_MODE_LABELS[entry.mode]} ·{" "}
                    {formatHistoryDate(entry.updatedAt)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex w-full flex-col gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPrompt(prompt)}
              className={cn(
                "w-full rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm leading-snug text-text transition-default focus-ring",
                "hover:border-primary/30 hover:bg-primary-muted/35 disabled:opacity-50",
              )}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
