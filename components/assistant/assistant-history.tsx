"use client";

import type { AssistantHistoryEntry } from "@/lib/ai/history";
import { ASSISTANT_MODE_LABELS } from "@/lib/ai/types";
import { cn } from "@/lib/utils";
import { History, Trash2, X } from "lucide-react";

interface AssistantHistoryPanelProps {
  entries: AssistantHistoryEntry[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AssistantHistoryPanel({
  entries,
  onRestore,
  onDelete,
  onClearAll,
  onClose,
}: AssistantHistoryPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-text">
          <History className="h-4 w-4" /> Study history
        </p>
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-semibold text-muted underline transition-default hover:text-error focus-ring"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close history"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-default hover:bg-muted-surface hover:text-text focus-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4">
        {entries.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted">
            No saved sessions yet. Your chats, quizzes, and summaries will
            appear here automatically.
          </p>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id}>
                <div
                  className={cn(
                    "group flex items-start gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 transition-default",
                    "hover:border-primary/30 hover:bg-primary-muted/20",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onRestore(entry.id)}
                    className="min-w-0 flex-1 text-left focus-ring"
                  >
                    <p className="truncate text-sm font-medium text-text">
                      {entry.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {ASSISTANT_MODE_LABELS[entry.mode]} ·{" "}
                      {formatDate(entry.updatedAt)} · {entry.messages.length}{" "}
                      messages
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry.id)}
                    aria-label={`Delete ${entry.title}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted opacity-0 transition-default hover:bg-error/10 hover:text-error focus-ring group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
