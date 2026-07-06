"use client";

import { useTheme } from "@/components/providers/theme-provider";
import type { BackgroundStyle, ColorScheme } from "@/lib/theme/types";
import { useEffect } from "react";

interface ThemeSyncProps {
  colorScheme: ColorScheme;
  backgroundStyle: BackgroundStyle;
}

/** Applies logged-in user theme preferences from the server. */
export function ThemeSync({ colorScheme, backgroundStyle }: ThemeSyncProps) {
  const { syncFromServer } = useTheme();

  useEffect(() => {
    syncFromServer({ colorScheme, backgroundStyle });
  }, [colorScheme, backgroundStyle, syncFromServer]);

  return null;
}
