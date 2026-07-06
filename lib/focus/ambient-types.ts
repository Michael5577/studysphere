export const AMBIENT_SOUND_IDS = [
  "silence",
  "lofi",
  "rain",
  "library",
  "cafe",
  "forest",
  "brown",
  "white",
] as const;

export type AmbientSoundId = (typeof AMBIENT_SOUND_IDS)[number];

export interface AmbientSoundOption {
  id: AmbientSoundId;
  label: string;
  description: string;
}

export const AMBIENT_SOUNDS: AmbientSoundOption[] = [
  {
    id: "silence",
    label: "Off",
    description: "No background audio",
  },
  {
    id: "lofi",
    label: "Lo-fi",
    description: "Warm chords, soft beat — musical, not noise",
  },
  {
    id: "rain",
    label: "Rain",
    description: "Pattering droplets on glass — not a static hiss",
  },
  {
    id: "library",
    label: "Library",
    description: "Mostly quiet — page turns and soft room tone",
  },
  {
    id: "cafe",
    label: "Café",
    description: "Muffled voices and cup clinks — busy mid-range",
  },
  {
    id: "forest",
    label: "Forest",
    description: "Wind, birds, and crickets — outdoor tones",
  },
  {
    id: "brown",
    label: "Deep Focus",
    description: "Low rumble only — blocks distractions",
  },
  {
    id: "white",
    label: "Air",
    description: "Bright high hiss — the opposite of deep focus",
  },
];

export const FOCUS_AMBIENT_STORAGE_KEY = "studysphere-focus-ambient";
export const FOCUS_AMBIENT_VOLUME_KEY = "studysphere-focus-ambient-volume";
export const FOCUS_AMBIENT_MUTED_KEY = "studysphere-focus-ambient-muted";

export function readStoredAmbientSound(): AmbientSoundId {
  if (typeof window === "undefined") {
    return "silence";
  }

  try {
    const stored = localStorage.getItem(FOCUS_AMBIENT_STORAGE_KEY);

    if (stored && AMBIENT_SOUND_IDS.includes(stored as AmbientSoundId)) {
      return stored as AmbientSoundId;
    }
  } catch {
    // ignore
  }

  return "silence";
}

export function writeStoredAmbientSound(id: AmbientSoundId) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(FOCUS_AMBIENT_STORAGE_KEY, id);
}

export function readStoredAmbientVolume(): number {
  if (typeof window === "undefined") {
    return 0.42;
  }

  try {
    const stored = localStorage.getItem(FOCUS_AMBIENT_VOLUME_KEY);
    const value = stored ? Number(stored) : 0.42;

    if (Number.isFinite(value)) {
      return Math.min(1, Math.max(0, value));
    }
  } catch {
    // ignore
  }

  return 0.42;
}

export function writeStoredAmbientVolume(value: number) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    FOCUS_AMBIENT_VOLUME_KEY,
    String(Math.min(1, Math.max(0, value))),
  );
}

export function readStoredAmbientMuted(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return localStorage.getItem(FOCUS_AMBIENT_MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeStoredAmbientMuted(muted: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(FOCUS_AMBIENT_MUTED_KEY, muted ? "1" : "0");
}
