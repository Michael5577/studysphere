"use client";

import type { QuizPayload, QuizQuestion } from "@/lib/ai/quiz-parse";
import { cn } from "@/lib/utils";
import { CheckCircle2, Flame, RotateCcw, Trophy, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

export type QuizPlayMode = "practice" | "exam";

interface AssistantInteractiveQuizProps {
  quiz: QuizPayload;
  playMode?: QuizPlayMode;
}

const CORRECT_MESSAGES = [
  "Nice! You locked that one in.",
  "Correct — that concept is sticking.",
  "Great work. Keep the streak alive.",
  "Exactly right. You're on a roll.",
];

const WRONG_MESSAGES = [
  "Not quite — but this is exactly how you learn.",
  "Close. Review the explanation and keep going.",
  "Missed it, but now you know what to watch for.",
];

function pickMessage(messages: string[], seed: number): string {
  return messages[seed % messages.length];
}

interface FinalScreenProps {
  quiz: QuizPayload;
  answers: (number | null)[];
  correctCount: number;
  bestStreak: number;
  onRestart: () => void;
}

function FinalScreen({ quiz, answers, correctCount, bestStreak, onRestart }: FinalScreenProps) {
  const total = quiz.questions.length;
  const percent = Math.round((correctCount / total) * 100);
  const missed = quiz.questions.filter(
    (question, index) => answers[index] !== question.correctIndex,
  );

  const verdict =
    percent >= 90
      ? { label: "Outstanding!", note: "You've mastered this topic." }
      : percent >= 70
        ? { label: "Strong work", note: "A quick review and you'll have it down." }
        : { label: "Keep going", note: "Review the explanations below and try again." };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-primary/20 bg-primary-muted/30 px-4 py-4 text-center">
        {percent >= 90 && (
          <Trophy className="mx-auto mb-2 h-8 w-8 text-warning" aria-hidden />
        )}
        <p className="font-serif text-lg font-semibold text-text">{verdict.label}</p>
        <p className="mt-1 text-2xl font-bold text-primary">
          {correctCount} / {total}
          <span className="ml-2 text-base font-semibold text-muted">({percent}%)</span>
        </p>
        <p className="mt-1 text-sm text-muted">{verdict.note}</p>
        {bestStreak >= 3 && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
            <Flame className="h-3.5 w-3.5" /> Best streak: {bestStreak} in a row
          </p>
        )}
      </div>

      {missed.length > 0 && (
        <div className="space-y-2 rounded-xl border border-border/70 bg-background/40 px-3 py-3">
          <p className="text-sm font-semibold text-text">Review these ({missed.length})</p>
          {missed.map((question) => (
            <div key={question.id} className="rounded-lg bg-surface/70 px-3 py-2">
              <p className="text-sm font-medium leading-snug text-text">{question.prompt}</p>
              <p className="mt-1 text-xs leading-snug text-success">
                Answer: {question.options[question.correctIndex]}
              </p>
              {question.explanation && (
                <p className="mt-1 text-xs leading-snug text-muted">{question.explanation}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition-default hover:bg-muted-surface focus-ring"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

export function AssistantInteractiveQuiz({
  quiz,
  playMode = "practice",
}: AssistantInteractiveQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    quiz.questions.map(() => null),
  );
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const question: QuizQuestion | undefined = quiz.questions[currentIndex];
  const total = quiz.questions.length;
  const selectedIndex = answers[currentIndex];
  const answeredCount = useMemo(
    () => answers.filter((answer) => answer !== null).length,
    [answers],
  );
  const correctCount = useMemo(
    () =>
      quiz.questions.reduce(
        (count, item, index) => (answers[index] === item.correctIndex ? count + 1 : count),
        0,
      ),
    [answers, quiz.questions],
  );

  const isExam = playMode === "exam";
  const showFeedback = !isExam && revealed;

  function handleSelect(optionIndex: number) {
    if (!question || answers[currentIndex] !== null) {
      return;
    }

    setAnswers((current) => {
      const next = [...current];
      next[currentIndex] = optionIndex;
      return next;
    });

    const isCorrect = optionIndex === question.correctIndex;

    if (isCorrect) {
      setStreak((current) => {
        const next = current + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else {
      setStreak(0);
    }

    if (isExam) {
      // Exam mode: auto-advance without revealing correctness.
      window.setTimeout(() => {
        if (currentIndex >= total - 1) {
          setFinished(true);
        } else {
          setCurrentIndex((index) => index + 1);
        }
      }, 250);
    } else {
      setRevealed(true);
    }
  }

  function handleNext() {
    if (currentIndex >= total - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setRevealed(false);
  }

  function handleRestart() {
    setAnswers(quiz.questions.map(() => null));
    setCurrentIndex(0);
    setRevealed(false);
    setStreak(0);
    setBestStreak(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <FinalScreen
        quiz={quiz}
        answers={answers}
        correctCount={correctCount}
        bestStreak={bestStreak}
        onRestart={handleRestart}
      />
    );
  }

  if (!question) {
    return null;
  }

  const progress = (answeredCount / total) * 100;
  const wasCorrect = selectedIndex === question.correctIndex;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted">
        <span>
          Question {currentIndex + 1} of {total}
          {isExam && <span className="ml-1.5 rounded bg-secondary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">Exam</span>}
        </span>
        <span className="flex items-center gap-2">
          {!isExam && streak >= 2 && (
            <span className="inline-flex items-center gap-0.5 text-warning">
              <Flame className="h-3.5 w-3.5" /> {streak}
            </span>
          )}
          {!isExam && (
            <span>
              Score: {correctCount}/{answeredCount}
            </span>
          )}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-background/80">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[15px] font-medium leading-snug text-text">{question.prompt}</p>

      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === question.correctIndex;

          return (
            <button
              key={`${question.id}-${index}`}
              type="button"
              disabled={selectedIndex !== null}
              onClick={() => handleSelect(index)}
              className={cn(
                "flex w-full items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-sm leading-snug transition-default focus-ring",
                selectedIndex === null &&
                  "border-border bg-surface hover:border-primary/30 hover:bg-primary-muted/20",
                showFeedback && isCorrect && "border-success/40 bg-success/10 text-text",
                showFeedback && isSelected && !isCorrect && "border-error/40 bg-error/10 text-text",
                showFeedback && !isSelected && !isCorrect && "border-border/60 bg-surface/50 text-muted",
                isExam && isSelected && "border-primary/50 bg-primary-muted/30",
                isExam && selectedIndex !== null && !isSelected && "border-border/60 bg-surface/50 text-muted",
              )}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[11px] font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="min-w-0 flex-1">{option}</span>
              {showFeedback && isCorrect && (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              )}
              {showFeedback && isSelected && !isCorrect && (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div
          className={cn(
            "space-y-2 rounded-xl border px-3 py-2.5",
            wasCorrect
              ? "border-success/30 bg-success/5 quiz-celebrate"
              : "border-border/70 bg-background/40",
          )}
        >
          <p
            className={cn(
              "text-sm font-semibold",
              wasCorrect ? "text-success" : "text-error",
            )}
          >
            {wasCorrect
              ? pickMessage(CORRECT_MESSAGES, currentIndex + streak)
              : pickMessage(WRONG_MESSAGES, currentIndex)}
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
