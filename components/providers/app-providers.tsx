"use client";

import { ToastProvider } from "@/components/ui/toast-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { ThemeSettings } from "@/lib/theme/types";
import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
  initialTheme?: Partial<ThemeSettings>;
}

export function AppProviders({ children, initialTheme }: AppProvidersProps) {
  return (
    <ThemeProvider initialSettings={initialTheme}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
