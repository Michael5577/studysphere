"use client";

import { applyThemeToDocument } from "@/lib/theme/apply";
import { resolveTheme, systemPrefersDark } from "@/lib/theme/resolve";
import { readStoredTheme, writeStoredTheme } from "@/lib/theme/storage";
import {
  DEFAULT_THEME,
  type BackgroundStyle,
  type ColorScheme,
  type ThemeSettings,
} from "@/lib/theme/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ThemeContextValue {
  colorScheme: ColorScheme;
  backgroundStyle: BackgroundStyle;
  resolvedTheme: "light" | "dark";
  setColorScheme: (scheme: ColorScheme) => void;
  setBackgroundStyle: (style: BackgroundStyle) => void;
  cycleColorScheme: () => void;
  syncFromServer: (settings: Partial<ThemeSettings>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export function useThemeOptional() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
  initialSettings?: Partial<ThemeSettings>;
}

export function ThemeProvider({
  children,
  initialSettings,
}: ThemeProviderProps) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const stored = readStoredTheme();

    return {
      colorScheme: initialSettings?.colorScheme ?? stored.colorScheme,
      backgroundStyle:
        initialSettings?.backgroundStyle ?? stored.backgroundStyle,
    };
  });

  const [prefersDark, setPrefersDark] = useState(systemPrefersDark);

  const resolvedTheme = useMemo(
    () => resolveTheme(settings.colorScheme, prefersDark),
    [settings.colorScheme, prefersDark],
  );

  useEffect(() => {
    const resolved = resolveTheme(settings.colorScheme, prefersDark);
    applyThemeToDocument(
      resolved,
      settings.colorScheme,
      settings.backgroundStyle,
    );
    writeStoredTheme(settings);
  }, [settings, prefersDark]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange(event: MediaQueryListEvent) {
      setPrefersDark(event.matches);
    }

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    setSettings((current) => ({ ...current, colorScheme }));
  }, []);

  const setBackgroundStyle = useCallback((backgroundStyle: BackgroundStyle) => {
    setSettings((current) => ({ ...current, backgroundStyle }));
  }, []);

  const cycleColorScheme = useCallback(() => {
    setSettings((current) => {
      const order: ColorScheme[] = ["light", "dark", "system"];
      const index = order.indexOf(current.colorScheme);
      const next = order[(index + 1) % order.length] ?? DEFAULT_THEME.colorScheme;
      return { ...current, colorScheme: next };
    });
  }, []);

  const syncFromServer = useCallback((patch: Partial<ThemeSettings>) => {
    setSettings((current) => ({
      colorScheme: patch.colorScheme ?? current.colorScheme,
      backgroundStyle: patch.backgroundStyle ?? current.backgroundStyle,
    }));
  }, []);

  const value = useMemo(
    () => ({
      colorScheme: settings.colorScheme,
      backgroundStyle: settings.backgroundStyle,
      resolvedTheme,
      setColorScheme,
      setBackgroundStyle,
      cycleColorScheme,
      syncFromServer,
    }),
    [
      settings,
      resolvedTheme,
      setColorScheme,
      setBackgroundStyle,
      cycleColorScheme,
      syncFromServer,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
