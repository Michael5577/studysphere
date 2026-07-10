"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] page error", error);
  }, [error]);

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
        <AlertTriangle className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h1 className="mt-4 font-serif text-xl font-semibold text-text">
        Something went wrong loading this page
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Your data is safe. Try again, or head back to your dashboard.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button type="button" onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition-default hover:bg-muted-surface focus-ring"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
