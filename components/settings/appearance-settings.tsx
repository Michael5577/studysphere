"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { updatePreferencesAction } from "@/lib/actions/preferences-actions";
import { useToast } from "@/components/ui/toast-provider";
import {
  BACKGROUND_STYLE_DESCRIPTIONS,
  BACKGROUND_STYLE_LABELS,
  BACKGROUND_STYLES,
  COLOR_SCHEME_LABELS,
  COLOR_SCHEMES,
  type BackgroundStyle,
  type ColorScheme,
} from "@/lib/theme/types";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sparkles, Sun, Waves } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schemeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

const styleIcons = {
  vivid: Sparkles,
  organic: Waves,
  minimal: Sun,
  aurora: Moon,
} as const;

interface AppearanceSettingsProps {
  initialColorScheme: ColorScheme;
  initialBackgroundStyle: BackgroundStyle;
}

export function AppearanceSettings({
  initialColorScheme,
  initialBackgroundStyle,
}: AppearanceSettingsProps) {
  const router = useRouter();
  const toast = useToast();
  const { setColorScheme, setBackgroundStyle, colorScheme, backgroundStyle } =
    useTheme();
  const [saving, setSaving] = useState(false);

  async function persist(patch: {
    color_scheme?: ColorScheme;
    background_style?: BackgroundStyle;
  }) {
    setSaving(true);
    const result = await updatePreferencesAction(patch);
    setSaving(false);

    if (result.ok) {
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function handleColorScheme(next: ColorScheme) {
    setColorScheme(next);
    await persist({ color_scheme: next });
  }

  async function handleBackgroundStyle(next: BackgroundStyle) {
    setBackgroundStyle(next);
    await persist({ background_style: next });
  }

  const activeScheme = colorScheme ?? initialColorScheme;
  const activeBackground = backgroundStyle ?? initialBackgroundStyle;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium text-text">Color mode</p>
        <div className="grid grid-cols-3 gap-2">
          {COLOR_SCHEMES.map((scheme) => {
            const Icon = schemeIcons[scheme];
            const isActive = activeScheme === scheme;

            return (
              <button
                key={scheme}
                type="button"
                disabled={saving}
                onClick={() => handleColorScheme(scheme)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-[var(--radius)] border px-3 py-4 text-center transition-default focus-ring disabled:opacity-50",
                  isActive
                    ? "border-primary bg-primary-muted text-primary shadow-[var(--shadow-subtle)]"
                    : "border-border bg-surface text-muted hover:border-primary/30 hover:text-text",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-semibold">
                  {COLOR_SCHEME_LABELS[scheme]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-text">Background style</p>
        <p className="mb-3 text-caption">
          Pick how your workspace feels — from lively gradients to clean minimal.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {BACKGROUND_STYLES.map((style) => {
            const Icon = styleIcons[style];
            const isActive = activeBackground === style;

            return (
              <button
                key={style}
                type="button"
                disabled={saving}
                onClick={() => handleBackgroundStyle(style)}
                className={cn(
                  "flex items-start gap-3 rounded-[var(--radius)] border p-4 text-left transition-default focus-ring disabled:opacity-50",
                  isActive
                    ? "border-primary bg-primary-muted/60 shadow-[var(--shadow-subtle)]"
                    : "border-border bg-surface hover:border-primary/30",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted-surface text-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text">
                    {BACKGROUND_STYLE_LABELS[style]}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                    {BACKGROUND_STYLE_DESCRIPTIONS[style]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
