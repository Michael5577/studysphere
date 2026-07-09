"use client";

import { EXAMPLE_PROMPTS, type AssistantMode } from "@/lib/ai/types";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface AssistantEmptyStateProps {
  mode: AssistantMode;
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
  isOffline?: boolean;
}

export function AssistantEmptyState({
  mode,
  onSelectPrompt,
  disabled = false,
  isOffline = false,
}: AssistantEmptyStateProps) {
  const prompts = EXAMPLE_PROMPTS[mode];

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
