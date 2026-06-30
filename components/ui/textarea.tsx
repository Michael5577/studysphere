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
          "flex min-h-20 w-full rounded-[var(--radius)] border bg-surface px-3 py-2 text-sm text-text",
          "placeholder:text-muted/60 transition-default focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-error focus-visible:outline-error/40"
            : "border-border focus-visible:border-primary/50",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
