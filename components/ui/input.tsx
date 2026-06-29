import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-9 w-full rounded-[var(--radius)] border bg-surface px-3 text-sm text-text",
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

Input.displayName = "Input";
