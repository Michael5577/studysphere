import type { BackgroundStyle, ColorScheme, ResolvedTheme } from "@/lib/theme/types";

export function applyThemeToDocument(
  resolvedTheme: ResolvedTheme,
  colorScheme: ColorScheme,
  backgroundStyle: BackgroundStyle,
) {
  const root = document.documentElement;

  root.dataset.theme = resolvedTheme;
  root.dataset.colorScheme = colorScheme;
  root.dataset.bg = backgroundStyle;
  root.style.colorScheme = resolvedTheme;
}
