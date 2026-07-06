"use client";

import { useAssistant } from "@/components/assistant/assistant-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ASSISTANT_MODE_LABELS, type AssistantMode } from "@/lib/ai/types";
import { Sparkles } from "lucide-react";

interface AssistantTriggerProps {
  variant?: "sidebar" | "compact";
  className?: string;
}

export function AssistantTrigger({
  variant = "compact",
  className,
}: AssistantTriggerProps) {
  const { openAssistant, open } = useAssistant();

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={openAssistant}
        aria-expanded={open}
        aria-label="Open AI Assistant"
        className={cn(
          "mx-2.5 mb-2 w-[calc(100%-1.25rem)] rounded-[var(--radius-lg)] border border-primary/20 bg-primary-muted/50 p-3 text-left transition-default focus-ring",
          "hover:border-primary/35 hover:bg-primary-muted/80",
          open && "border-primary/40 bg-primary-muted shadow-[var(--shadow-subtle)]",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-text">
              AI Assistant
            </span>
            <span className="mt-0.5 block text-xs text-muted">
              Ask, summarize, flashcards
            </span>
          </span>
          <kbd className="hidden rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted xl:inline">
            ⌘J
          </kbd>
        </div>
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={openAssistant}
      aria-expanded={open}
      aria-label="Open AI Assistant"
      className={cn("shrink-0", className)}
      title="AI Assistant (⌘J)"
    >
      <Sparkles className="h-4 w-4" />
      <span className="hidden sm:inline">AI</span>
    </Button>
  );
}

interface AssistantModeTabsProps {
  mode: AssistantMode;
  onChange: (mode: AssistantMode) => void;
  className?: string;
}

export function AssistantModeTabs({
  mode,
  onChange,
  className,
}: AssistantModeTabsProps) {
  const modes: AssistantMode[] = ["chat", "summarize", "flashcards"];

  return (
    <div
      className={cn("flex gap-1 rounded-full bg-muted-surface p-1", className)}
      role="tablist"
      aria-label="Assistant mode"
    >
      {modes.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={mode === item}
          onClick={() => onChange(item)}
          className={cn(
            "flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-default focus-ring",
            mode === item
              ? "bg-surface text-primary shadow-[var(--shadow-subtle)]"
              : "text-muted hover:text-text",
          )}
        >
          {ASSISTANT_MODE_LABELS[item]}
        </button>
      ))}
    </div>
  );
}
