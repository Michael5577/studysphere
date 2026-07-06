import type { ColorScheme, ResolvedTheme } from "@/lib/theme/types";

export function resolveTheme(
  colorScheme: ColorScheme,
  prefersDark = false,
): ResolvedTheme {
  if (colorScheme === "system") {
    return prefersDark ? "dark" : "light";
  }

  return colorScheme;
}

export function systemPrefersDark(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
