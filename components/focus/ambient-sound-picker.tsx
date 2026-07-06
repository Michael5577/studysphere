"use client";

import { getFocusAmbientEngine } from "@/lib/focus/ambient-engine";
import {
  AMBIENT_SOUNDS,
  readStoredAmbientMuted,
  readStoredAmbientSound,
  readStoredAmbientVolume,
  writeStoredAmbientMuted,
  writeStoredAmbientSound,
  writeStoredAmbientVolume,
  type AmbientSoundId,
} from "@/lib/focus/ambient-types";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CloudRain,
  Coffee,
  Music2,
  Trees,
  Volume2,
  VolumeX,
  Waves,
  Wind,
} from "lucide-react";
import { useCallback, useEffect, useState, type ComponentType } from "react";

const SOUND_ICONS: Record<
  Exclude<AmbientSoundId, "silence">,
  ComponentType<{ className?: string }>
> = {
  lofi: Music2,
  rain: CloudRain,
  library: BookOpen,
  cafe: Coffee,
  forest: Trees,
  brown: Waves,
  white: Wind,
};

interface AmbientSoundPickerProps {
  sessionActive: boolean;
  disabled?: boolean;
}

export function AmbientSoundPicker({
  sessionActive,
  disabled = false,
}: AmbientSoundPickerProps) {
  const [selected, setSelected] = useState<AmbientSoundId>(() =>
    typeof window === "undefined" ? "silence" : readStoredAmbientSound(),
  );
  const [previewing, setPreviewing] = useState(false);
  const [volume, setVolume] = useState(() =>
    typeof window === "undefined" ? 0.42 : readStoredAmbientVolume(),
  );
  const [muted, setMuted] = useState(() =>
    typeof window === "undefined" ? false : readStoredAmbientMuted(),
  );

  const shouldPlay =
    selected !== "silence" &&
    !muted &&
    volume > 0 &&
    (sessionActive || previewing);

  const syncPlayback = useCallback(async () => {
    const engine = getFocusAmbientEngine();
    engine.setMuted(muted);
    engine.setVolume(volume);

    if (!shouldPlay) {
      await engine.stop();
      return;
    }

    await engine.start(selected);
  }, [muted, selected, shouldPlay, volume]);

  useEffect(() => {
    void syncPlayback();
  }, [syncPlayback]);

  useEffect(() => {
    return () => {
      void getFocusAmbientEngine().stop();
    };
  }, []);

  async function handleSelect(id: AmbientSoundId) {
    if (disabled) {
      return;
    }

    setSelected(id);
    writeStoredAmbientSound(id);

    if (id === "silence") {
      setPreviewing(false);
      setMuted(true);
      writeStoredAmbientMuted(true);
      await getFocusAmbientEngine().stop();
      return;
    }

    if (muted) {
      setMuted(false);
      writeStoredAmbientMuted(false);
    }

    if (!sessionActive) {
      setPreviewing(true);
    }
  }

  async function handleToggleMute() {
    if (disabled) {
      return;
    }

    const nextMuted = !muted;
    setMuted(nextMuted);
    writeStoredAmbientMuted(nextMuted);

    const engine = getFocusAmbientEngine();
    engine.setMuted(nextMuted);

    if (nextMuted) {
      await engine.stop();
      return;
    }

    if (selected !== "silence" && (sessionActive || previewing)) {
      await engine.start(selected);
    }
  }

  function handleVolumeChange(value: number) {
    setVolume(value);
    writeStoredAmbientVolume(value);

    const engine = getFocusAmbientEngine();
    engine.setVolume(value);

    if (value <= 0 && !muted) {
      setMuted(true);
      writeStoredAmbientMuted(true);
      void engine.stop();
      return;
    }

    if (value > 0 && muted && selected !== "silence") {
      setMuted(false);
      writeStoredAmbientMuted(false);
      engine.setMuted(false);

      if (sessionActive || previewing) {
        void engine.start(selected);
      }
    }
  }

  const activeMeta = AMBIENT_SOUNDS.find((sound) => sound.id === selected);
  const isAudible = shouldPlay;
  const soundOptions = AMBIENT_SOUNDS.filter((sound) => sound.id !== "silence");

  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-left">
          <p className="text-label">Ambient sound</p>
          <p className="mt-0.5 text-caption">
            Pick a vibe — each sound uses a different engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled || selected === "silence"}
            onClick={() => void handleToggleMute()}
            aria-pressed={muted || selected === "silence"}
            aria-label={muted || selected === "silence" ? "Unmute ambient sound" : "Mute ambient sound"}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-default focus-ring touch-manipulation disabled:opacity-50",
              muted || selected === "silence"
                ? "border-border bg-surface text-muted"
                : "border-primary/30 bg-primary-muted text-primary",
            )}
          >
            {muted || selected === "silence" ? (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                Muted
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                Sound on
              </>
            )}
          </button>

          <input
            type="range"
            min={0}
            max={0.85}
            step={0.05}
            value={volume}
            disabled={disabled || selected === "silence"}
            onChange={(event) => handleVolumeChange(Number(event.target.value))}
            aria-label="Ambient volume"
            className="h-1.5 w-24 accent-primary disabled:opacity-40"
          />
        </div>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="listbox"
        aria-label="Ambient sounds"
      >
        <button
          type="button"
          role="option"
          aria-selected={selected === "silence"}
          disabled={disabled}
          title="No background audio"
          onClick={() => void handleSelect("silence")}
          className={cn(
            "flex min-w-[4.75rem] shrink-0 flex-col items-center gap-1.5 rounded-[var(--radius-lg)] border px-3 py-3 text-center transition-default focus-ring touch-manipulation disabled:opacity-50",
            selected === "silence"
              ? "border-primary bg-primary-muted text-primary shadow-[var(--shadow-subtle)]"
              : "border-border bg-surface text-muted hover:border-primary/30 hover:text-text",
          )}
        >
          <VolumeX className="h-4 w-4" />
          <span className="text-[11px] font-semibold leading-tight">Off</span>
        </button>

        {soundOptions.map((sound) => {
          const Icon = SOUND_ICONS[sound.id as Exclude<AmbientSoundId, "silence">];
          const isActive = selected === sound.id;

          return (
            <button
              key={sound.id}
              type="button"
              role="option"
              aria-selected={isActive}
              disabled={disabled}
              title={sound.description}
              onClick={() => void handleSelect(sound.id)}
              className={cn(
                "flex min-w-[5.25rem] shrink-0 flex-col items-center gap-1.5 rounded-[var(--radius-lg)] border px-3 py-3 text-center transition-default focus-ring touch-manipulation disabled:opacity-50",
                isActive
                  ? "border-primary bg-primary-muted text-primary shadow-[var(--shadow-subtle)]"
                  : "border-border bg-surface text-muted hover:border-primary/30 hover:text-text",
                isAudible && isActive && "ambient-chip-live",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[11px] font-semibold leading-tight">
                {sound.label}
              </span>
            </button>
          );
        })}
      </div>

      {activeMeta && (
        <p className="mt-3 text-center text-xs text-muted">
          {selected === "silence"
            ? "Ambient audio is off. Pick a sound or tap play to focus in silence."
            : activeMeta.description}
          {previewing && !sessionActive && selected !== "silence" && !muted
            ? " · Previewing — start focus to keep it playing"
            : null}
        </p>
      )}
    </div>
  );
}
