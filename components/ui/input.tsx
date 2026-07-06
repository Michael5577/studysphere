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
          "block h-12 w-full min-w-0 max-w-full rounded-full border bg-white/60 px-4 text-base text-text sm:text-sm",
          "placeholder:text-muted/70 transition-default focus-ring",
          "[-webkit-appearance:none] appearance-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-error focus-visible:outline-error/40"
            : "border-border focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
