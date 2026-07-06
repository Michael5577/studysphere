"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getRandomBreakChallenge,
  type BreakChallenge,
} from "@/lib/focus/break-challenges";
import { cn } from "@/lib/utils";
import { Brain, Lightbulb, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

interface BreakChallengePanelProps {
  breakLabel: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function BreakChallengePanel({
  breakLabel,
  onComplete,
  onSkip,
}: BreakChallengePanelProps) {
  const [challenge, setChallenge] = useState<BreakChallenge>(() =>
    getRandomBreakChallenge(),
  );
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);

  const canSkip = wrongAttempts >= 2;

  const categoryLabel = useMemo(() => {
    switch (challenge.category) {
      case "logic":
        return "Logic";
      case "math":
        return "Quick math";
      case "vocabulary":
        return "Vocabulary";
      case "science":
        return "Science";
    }
  }, [challenge.category]);

  function handleAnswer(index: number) {
    setSelectedIndex(index);

    if (index === challenge.correctIndex) {
      onComplete();
      return;
    }

    setWrongAttempts((count) => count + 1);
    setShowHint(true);
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  }

  function handleTryAnother() {
    setChallenge((current) => getRandomBreakChallenge(current.id));
    setSelectedIndex(null);
    setShowHint(false);
  }

  return (
    <Card
      padding="lg"
      className={cn(
        "surface-card border-secondary/30 bg-accent/20 transition-default",
        shake && "animate-[shake_0.45s_ease-in-out]",
      )}
    >
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
          <Brain className="h-6 w-6" strokeWidth={1.75} />
        </div>

        <p className="text-label text-secondary">Break unlock</p>
        <h3 className="mt-1 font-serif text-heading">
          Solve a quick brain teaser
        </h3>
        <p className="mt-2 text-caption">
          Earn your {breakLabel.toLowerCase()} with a small mental reset.
        </p>
      </div>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-border/60 bg-surface/80 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-3 w-3" />
            {categoryLabel}
          </span>
          {wrongAttempts > 0 && (
            <span className="text-caption">
              Attempt {wrongAttempts + 1}
            </span>
          )}
        </div>

        <p className="text-sm font-medium leading-relaxed text-text">
          {challenge.prompt}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {challenge.options.map((option, index) => (
            <button
              key={option}
              type="button"
              onClick={() => handleAnswer(index)}
              className={cn(
                "rounded-full border px-4 py-3 text-left text-sm font-medium transition-default focus-ring touch-manipulation",
                selectedIndex === index && index !== challenge.correctIndex
                  ? "border-error/40 bg-error/5 text-error"
                  : "border-border bg-surface hover:border-primary/30 hover:bg-primary-muted/40",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {showHint && (
          <div className="mt-4 flex items-start gap-2 rounded-[var(--radius-lg)] border border-secondary/20 bg-secondary/5 px-3 py-2.5 text-sm text-text">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p>{challenge.hint}</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={handleTryAnother}>
          Try another question
        </Button>
        {canSkip && (
          <Button variant="ghost" onClick={onSkip}>
            Skip to break
          </Button>
        )}
      </div>

      {!canSkip && wrongAttempts > 0 && (
        <p className="mt-3 text-center text-caption">
          One more try unlocks the skip option.
        </p>
      )}
    </Card>
  );
}
