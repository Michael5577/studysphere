import {
  BACKGROUND_STYLES,
  COLOR_SCHEMES,
  DEFAULT_THEME,
  type BackgroundStyle,
  type ColorScheme,
  type ThemeSettings,
} from "@/lib/theme/types";

export const THEME_STORAGE_KEY = "studysphere-theme";

export function readStoredTheme(): ThemeSettings {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);

    if (!raw) {
      return DEFAULT_THEME;
    }

    const parsed = JSON.parse(raw) as Partial<ThemeSettings>;

    return {
      colorScheme: COLOR_SCHEMES.includes(parsed.colorScheme as ColorScheme)
        ? (parsed.colorScheme as ColorScheme)
        : DEFAULT_THEME.colorScheme,
      backgroundStyle: BACKGROUND_STYLES.includes(
        parsed.backgroundStyle as BackgroundStyle,
      )
        ? (parsed.backgroundStyle as BackgroundStyle)
        : DEFAULT_THEME.backgroundStyle,
    };
  } catch {
    return DEFAULT_THEME;
  }
}

export function hasStoredTheme(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return localStorage.getItem(THEME_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function writeStoredTheme(settings: ThemeSettings) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
}
