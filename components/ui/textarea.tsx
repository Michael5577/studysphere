import { cn } from "@/lib/utils";
import { type TextareaHTMLAttributes, forwardRef } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "block min-h-24 w-full min-w-0 max-w-full rounded-[var(--radius-lg)] border bg-white/60 px-4 py-3 text-base text-text sm:text-sm",
          "placeholder:text-muted/70 transition-default focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-error"
            : "border-border focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
