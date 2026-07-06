export const COLOR_SCHEMES = ["light", "dark", "system"] as const;
export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export const BACKGROUND_STYLES = [
  "vivid",
  "organic",
  "minimal",
  "aurora",
] as const;
export type BackgroundStyle = (typeof BACKGROUND_STYLES)[number];

export type ResolvedTheme = "light" | "dark";

export interface ThemeSettings {
  colorScheme: ColorScheme;
  backgroundStyle: BackgroundStyle;
}

export const DEFAULT_THEME: ThemeSettings = {
  colorScheme: "system",
  backgroundStyle: "vivid",
};

export const COLOR_SCHEME_LABELS: Record<ColorScheme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export const BACKGROUND_STYLE_LABELS: Record<BackgroundStyle, string> = {
  vivid: "Vivid",
  organic: "Organic",
  minimal: "Minimal",
  aurora: "Aurora",
};

export const BACKGROUND_STYLE_DESCRIPTIONS: Record<BackgroundStyle, string> = {
  vivid: "Warm gradients and soft color washes — our liveliest look",
  organic: "Paper grain and forest-floor tones — calm and natural",
  minimal: "Clean and flat — no texture, maximum focus",
  aurora: "Gentle shifting glows — ambient and atmospheric",
};
