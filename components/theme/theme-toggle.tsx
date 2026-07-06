"use client";

import { useThemeOptional } from "@/components/providers/theme-provider";
import { updatePreferencesAction } from "@/lib/actions/preferences-actions";
import { Button } from "@/components/ui/button";
import { COLOR_SCHEME_LABELS, type ColorScheme } from "@/lib/theme/types";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const theme = useThemeOptional();

  if (!theme) {
    return null;
  }

  const { colorScheme, setColorScheme } = theme;

  const Icon =
    colorScheme === "dark" ? Moon : colorScheme === "light" ? Sun : Monitor;

  async function handleToggle() {
    const order: ColorScheme[] = ["light", "dark", "system"];
    const index = order.indexOf(colorScheme);
    const next = order[(index + 1) % order.length] ?? "system";

    setColorScheme(next);
    void updatePreferencesAction({ color_scheme: next });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("shrink-0", className)}
      onClick={() => void handleToggle()}
      aria-label={`Theme: ${COLOR_SCHEME_LABELS[colorScheme]}. Click to change.`}
      title={`Theme: ${COLOR_SCHEME_LABELS[colorScheme]}`}
    >
      <Icon className="h-4 w-4" />
      {showLabel && (
        <span className="hidden text-xs sm:inline">
          {COLOR_SCHEME_LABELS[colorScheme]}
        </span>
      )}
    </Button>
  );
}
