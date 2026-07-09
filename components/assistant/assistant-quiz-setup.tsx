"use client";

import type { QuizSettings } from "@/components/assistant/assistant-provider";
import { cn } from "@/lib/utils";

interface AssistantQuizSetupProps {
  settings: QuizSettings;
  onChange: (settings: QuizSettings) => void;
  disabled?: boolean;
}

const COUNTS: QuizSettings["questionCount"][] = [5, 10, 20];
const DIFFICULTIES: QuizSettings["difficulty"][] = [
  "easy",
  "medium",
  "hard",
  "mixed",
];

function Chip({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize transition-default focus-ring disabled:opacity-50",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted hover:border-primary/40 hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

export function AssistantQuizSetup({
  settings,
  onChange,
  disabled = false,
}: AssistantQuizSetupProps) {
  return (
    <div className="shrink-0 space-y-2 border-b border-border bg-background/40 px-3 py-2.5 sm:px-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
            Questions
          </span>
          {COUNTS.map((count) => (
            <Chip
              key={count}
              active={settings.questionCount === count}
              disabled={disabled}
              onClick={() => onChange({ ...settings, questionCount: count })}
            >
              {count}
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
            Difficulty
          </span>
          {DIFFICULTIES.map((difficulty) => (
            <Chip
              key={difficulty}
              active={settings.difficulty === difficulty}
              disabled={disabled}
              onClick={() => onChange({ ...settings, difficulty })}
            >
              {difficulty}
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
            Mode
          </span>
          <Chip
            active={settings.playMode === "practice"}
            disabled={disabled}
            onClick={() => onChange({ ...settings, playMode: "practice" })}
          >
            Practice
          </Chip>
          <Chip
            active={settings.playMode === "exam"}
            disabled={disabled}
            onClick={() => onChange({ ...settings, playMode: "exam" })}
          >
            Exam
          </Chip>
        </div>
      </div>
    </div>
  );
}
