"use client";

import { BreakChallengePanel } from "@/components/focus/break-challenge";
import { AmbientSoundPicker } from "@/components/focus/ambient-sound-picker";
import { getFocusAmbientEngine } from "@/lib/focus/ambient-engine";
import { saveFocusSessionAction } from "@/lib/actions/focus-actions";
import { FOCUS_PRESETS } from "@/lib/focus/presets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";
import { formatTimerDisplay } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Course, UserPreferences } from "@/types/database";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type TimerPhase = "focus" | "break_challenge" | "short_break" | "long_break";
type TimerStatus = "idle" | "running" | "paused";

interface FocusTimerProps {
  courses: Course[];
  preferences: UserPreferences;
}

const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: "Focus session",
  break_challenge: "Break unlock",
  short_break: "Short break",
  long_break: "Long break",
};

function getBreakDuration(
  phase: "short_break" | "long_break",
  preferences: UserPreferences,
): number {
  return phase === "short_break"
    ? preferences.break_duration_minutes * 60
    : preferences.long_break_duration_minutes * 60;
}

export function FocusTimer({ courses, preferences }: FocusTimerProps) {
  const router = useRouter();
  const toast = useToast();
  const [focusMinutes, setFocusMinutes] = useState(
    preferences.work_duration_minutes,
  );
  const [phase, setPhase] = useState<TimerPhase>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [secondsRemaining, setSecondsRemaining] = useState(
    preferences.work_duration_minutes * 60,
  );
  const [completedFocusCount, setCompletedFocusCount] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState(
    courses[0]?.id ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [pendingBreakPhase, setPendingBreakPhase] = useState<
    "short_break" | "long_break" | null
  >(null);

  const focusStartedAtRef = useRef<Date | null>(null);
  const endsAtRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const completingRef = useRef(false);

  const selectedCourse = courses.find((course) => course.id === selectedCourseId);

  const phaseDuration =
    phase === "focus"
      ? focusMinutes * 60
      : phase === "break_challenge"
        ? 1
        : getBreakDuration(phase, preferences);

  const resetSegment = useCallback(
    (nextPhase: TimerPhase, nextFocusMinutes = focusMinutes) => {
      completingRef.current = false;
      setPhase(nextPhase);
      setPendingBreakPhase(null);

      if (nextPhase === "focus") {
        setSecondsRemaining(nextFocusMinutes * 60);
      } else if (nextPhase === "break_challenge") {
        setSecondsRemaining(0);
      } else {
        setSecondsRemaining(getBreakDuration(nextPhase, preferences));
      }

      setStatus("idle");
      focusStartedAtRef.current = null;
      endsAtRef.current = null;
    },
    [focusMinutes, preferences],
  );

  const getNextBreakPhase = useCallback(
    (afterFocusCount: number): "short_break" | "long_break" => {
      if (afterFocusCount > 0 && afterFocusCount % 4 === 0) {
        return "long_break";
      }

      return "short_break";
    },
    [],
  );

  const getElapsedFocusSeconds = useCallback(() => {
    return Math.max(0, focusMinutes * 60 - secondsRemaining);
  }, [focusMinutes, secondsRemaining]);

  const saveFocusSession = useCallback(
    async (durationSeconds: number) => {
      const startedAt = focusStartedAtRef.current;

      if (!startedAt || durationSeconds < 1) {
        return true;
      }

      const endedAt = new Date();

      setSaving(true);
      const result = await saveFocusSessionAction({
        course_id: selectedCourseId || null,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSeconds,
      });
      setSaving(false);

      if (!result.ok) {
        toast.error(result.message);
        return false;
      }

      toast.success("Focus session saved");
      router.refresh();
      return true;
    },
    [router, selectedCourseId, toast],
  );

  const startBreakPhase = useCallback(
    (breakPhase: "short_break" | "long_break") => {
      resetSegment(breakPhase);
      endsAtRef.current = Date.now() + getBreakDuration(breakPhase, preferences) * 1000;
      setStatus("running");
    },
    [preferences, resetSegment],
  );

  const finishFocusPhase = useCallback(
    async (durationSeconds: number) => {
      const saved = await saveFocusSession(durationSeconds);

      if (!saved) {
        return;
      }

      const nextCount = completedFocusCount + 1;
      setCompletedFocusCount(nextCount);
      const nextBreak = getNextBreakPhase(nextCount);
      setPendingBreakPhase(nextBreak);
      setPhase("break_challenge");
      setStatus("idle");
      setSecondsRemaining(0);
      focusStartedAtRef.current = null;
      endsAtRef.current = null;
      completingRef.current = false;
    },
    [saveFocusSession, completedFocusCount, getNextBreakPhase],
  );

  const handlePhaseComplete = useCallback(async () => {
    if (phase === "focus") {
      await finishFocusPhase(focusMinutes * 60);
      return;
    }

    resetSegment("focus");
  }, [phase, finishFocusPhase, focusMinutes, resetSegment]);

  useEffect(() => {
    if (status !== "running" || !endsAtRef.current || phase === "break_challenge") {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }

    tickRef.current = window.setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((endsAtRef.current! - Date.now()) / 1000),
      );
      setSecondsRemaining(remaining);

      if (remaining <= 0 && !completingRef.current) {
        completingRef.current = true;
        setStatus("idle");
        endsAtRef.current = null;
        window.setTimeout(() => {
          void handlePhaseComplete();
        }, 0);
      }
    }, 250);

    return () => {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [status, phase, handlePhaseComplete]);

  function handlePresetSelect(minutes: number) {
    if (status !== "idle" || phase !== "focus") {
      return;
    }

    setFocusMinutes(minutes);
    setSecondsRemaining(minutes * 60);
  }

  function handleStartPause() {
    if (phase === "break_challenge") {
      return;
    }

    if (status === "idle") {
      if (phase === "focus") {
        focusStartedAtRef.current = new Date();
      }

      endsAtRef.current = Date.now() + secondsRemaining * 1000;
      setStatus("running");
      return;
    }

    if (status === "running") {
      const remaining = Math.max(
        0,
        Math.ceil((endsAtRef.current! - Date.now()) / 1000),
      );
      setSecondsRemaining(remaining);
      endsAtRef.current = null;
      setStatus("paused");
      return;
    }

    endsAtRef.current = Date.now() + secondsRemaining * 1000;
    setStatus("running");
  }

  function handleReset() {
    if (phase === "break_challenge") {
      resetSegment("focus");
      return;
    }

    resetSegment(phase);
  }

  async function handleSkip() {
    if (phase === "focus" && status !== "idle") {
      const elapsed = getElapsedFocusSeconds();

      if (elapsed < 5) {
        resetSegment("focus");
        return;
      }

      await finishFocusPhase(elapsed);
      return;
    }

    if (phase === "short_break" || phase === "long_break") {
      resetSegment("focus");
    }
  }

  const nextPhase =
    phase === "focus"
      ? getNextBreakPhase(completedFocusCount + 1)
      : phase === "break_challenge" && pendingBreakPhase
        ? pendingBreakPhase
        : "focus";

  const progress =
    phase === "break_challenge" ? 1 : 1 - secondsRemaining / phaseDuration;

  const canConfigure = status === "idle" && phase === "focus";
  const ambientSessionActive =
    phase === "focus" && (status === "running" || status === "paused");

  useEffect(() => {
    if (phase !== "focus" || status === "idle") {
      void getFocusAmbientEngine().stop();
    }
  }, [phase, status]);

  if (phase === "break_challenge" && pendingBreakPhase) {
    return (
      <BreakChallengePanel
        breakLabel={PHASE_LABELS[pendingBreakPhase]}
        onComplete={() => startBreakPhase(pendingBreakPhase)}
        onSkip={() => startBreakPhase(pendingBreakPhase)}
      />
    );
  }

  return (
    <Card padding="lg" className="surface-card relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-primary transition-[width] duration-300"
        style={{
          width: `${Math.max(progress * 100, status === "idle" ? 0 : 2)}%`,
        }}
        aria-hidden
      />

      <div className="text-center">
        <Badge
          variant={phase === "focus" ? "primary" : "outline"}
          className="mb-5"
        >
          {PHASE_LABELS[phase]}
        </Badge>

        <p className="font-mono text-6xl font-semibold tracking-tight text-text tabular-nums sm:text-7xl">
          {formatTimerDisplay(secondsRemaining)}
        </p>

        <p className="mt-3 text-caption">
          {phase === "focus"
            ? selectedCourse
              ? `${selectedCourse.code} — ${selectedCourse.name}`
              : "General focus"
            : `Next: ${PHASE_LABELS[nextPhase].toLowerCase()}`}
        </p>

        {phase === "focus" && (
          <>
            <div className="mx-auto mt-5 max-w-md">
              <p className="mb-2 text-label">Focus length</p>
              <div className="flex flex-wrap justify-center gap-2">
                {FOCUS_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={!canConfigure}
                    onClick={() => handlePresetSelect(preset.minutes)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm font-semibold transition-default focus-ring touch-manipulation disabled:opacity-50",
                      focusMinutes === preset.minutes
                        ? "border-primary bg-primary-muted text-primary"
                        : "border-border bg-surface text-muted hover:border-primary/30 hover:text-text",
                    )}
                    title={preset.description}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-caption">
                {FOCUS_PRESETS.find((preset) => preset.minutes === focusMinutes)
                  ?.description ?? "Custom length from settings"}
              </p>
            </div>

            <div className="mx-auto mt-5 max-w-xs">
              <Select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                disabled={status === "running"}
                aria-label="Course for focus session"
              >
                <option value="">General focus</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} — {course.name}
                  </option>
                ))}
              </Select>
            </div>
          </>
        )}

        {phase !== "focus" && (
          <p className="mx-auto mt-5 max-w-sm text-sm text-muted">
            {phase === "short_break"
              ? "Stretch, hydrate, and rest your eyes. A brain teaser unlocks every break."
              : "Longer reset — walk around, snack, and come back refreshed."}
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            disabled={saving}
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full p-0 shadow-sm"
            onClick={handleStartPause}
            disabled={saving}
            aria-label={status === "running" ? "Pause timer" : "Start timer"}
          >
            {status === "running" ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleSkip}
            disabled={saving || status === "idle"}
            aria-label="Skip session"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-caption">
          <span>Session {completedFocusCount + 1}</span>
          <span className="text-border">·</span>
          <span>
            {focusMinutes}m focus / {preferences.break_duration_minutes}m break
          </span>
          <span className="text-border">·</span>
          <span>Brain teaser before breaks</span>
        </div>

        {phase === "focus" && (
          <AmbientSoundPicker
            sessionActive={ambientSessionActive}
            disabled={saving}
          />
        )}
      </div>
    </Card>
  );
}
