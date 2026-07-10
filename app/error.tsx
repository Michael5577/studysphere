"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[root] error", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="font-serif text-xl font-semibold text-text">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-default hover:bg-primary-hover focus-ring"
      >
        Try again
      </button>
    </div>
  );
}
