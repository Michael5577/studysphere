"use client";

import type { QuizPayload } from "@/lib/ai/quiz-parse";
import { cn } from "@/lib/utils";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

interface AssistantInteractiveQuizProps {
  quiz: QuizPayload;
}

type QuestionState = "idle" | "correct" | "incorrect";

export function AssistantInteractiveQuiz({ quiz }: AssistantInteractiveQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [questionState, setQuestionState] = useState<QuestionState>("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[currentIndex];
  const total = quiz.questions.length;

  const scoreLabel = useMemo(() => {
    if (!finished) {
      return null;
    }

    return `${correctCount} / ${total} correct`;
  }, [correctCount, finished, total]);

  function handleSelect(optionIndex: number) {
    if (questionState !== "idle" || !question) {
      return;
    }

    setSelectedIndex(optionIndex);

    if (optionIndex === question.correctIndex) {
      setQuestionState("correct");
      setCorrectCount((count) => count + 1);
    } else {
      setQuestionState("incorrect");
    }
  }

  function handleNext() {
    if (currentIndex >= total - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedIndex(null);
    setQuestionState("idle");
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setQuestionState("idle");
    setCorrectCount(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-primary/20 bg-primary-muted/30 px-4 py-3 text-center">
          <p className="font-serif text-base font-semibold text-text">Quiz complete</p>
          <p className="mt-1 text-sm text-muted">{scoreLabel}</p>
        </div>
        <button
          type="button"
          onClick={handleRestart}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition-default hover:bg-muted-surface focus-ring"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted">
        <span>
          Question {currentIndex + 1} of {total}
        </span>
        <span>{Math.round(((currentIndex + (questionState !== "idle" ? 1 : 0)) / total) * 100)}%</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-background/80">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentIndex + (questionState !== "idle" ? 1 : 0)) / total) * 100}%`,
          }}
        />
      </div>

      <p className="text-[15px] font-medium leading-snug text-text">{question.prompt}</p>

      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === question.correctIndex;
          const showResult = questionState !== "idle";

          return (
            <button
              key={`${question.id}-${index}`}
              type="button"
              disabled={questionState !== "idle"}
              onClick={() => handleSelect(index)}
              className={cn(
                "flex w-full items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-sm leading-snug transition-default focus-ring",
                questionState === "idle" &&
                  "border-border bg-surface hover:border-primary/30 hover:bg-primary-muted/20",
                showResult && isCorrect && "border-success/40 bg-success/10 text-text",
                showResult &&
                  isSelected &&
                  !isCorrect &&
                  "border-error/40 bg-error/10 text-text",
                showResult &&
                  !isSelected &&
                  !isCorrect &&
                  "border-border/60 bg-surface/50 text-muted",
              )}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[11px] font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="min-w-0 flex-1">{option}</span>
              {showResult && isCorrect && (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
              )}
            </button>
          );
        })}
      </div>

      {questionState !== "idle" && (
        <div className="space-y-2 rounded-xl border border-border/70 bg-background/40 px-3 py-2.5">
          <p
            className={cn(
              "text-sm font-semibold",
              questionState === "correct" ? "text-success" : "text-error",
            )}
          >
            {questionState === "correct" ? "Correct!" : "Not quite."}
          </p>
          {question.explanation && (
            <p className="text-sm leading-snug text-muted">{question.explanation}</p>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-default hover:bg-primary-hover focus-ring"
          >
            {currentIndex >= total - 1 ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
