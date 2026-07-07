"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface AssistantOfflineBannerProps {
  onDismiss: () => void;
  className?: string;
}

export function AssistantOfflineBanner({
  onDismiss,
  className,
}: AssistantOfflineBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "mt-2 flex items-center gap-2 rounded-lg border border-primary/15 bg-primary-muted/40 px-2.5 py-1.5",
        className,
      )}
    >
      <p className="min-w-0 flex-1 text-[11px] leading-snug text-muted">
        Offline AI — add{" "}
        <span className="font-mono text-[10px] text-text">NVIDIA_API_KEY</span>{" "}
        or{" "}
        <span className="font-mono text-[10px] text-text">OPENAI_API_KEY</span>{" "}
        in Vercel to enable live tutoring.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss offline notice"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted transition-default hover:bg-surface/80 hover:text-text focus-ring"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
