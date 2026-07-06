export interface FocusPreset {
  id: string;
  label: string;
  minutes: number;
  description: string;
}

export const FOCUS_PRESETS: FocusPreset[] = [
  { id: "pomodoro", label: "25 min", minutes: 25, description: "Classic Pomodoro" },
  { id: "deep", label: "45 min", minutes: 45, description: "Deep work block" },
  { id: "hour", label: "1 hour", minutes: 60, description: "Extended focus" },
  { id: "marathon", label: "2 hours", minutes: 120, description: "Marathon session" },
];

export function getPresetByMinutes(minutes: number): FocusPreset | undefined {
  return FOCUS_PRESETS.find((preset) => preset.minutes === minutes);
}
