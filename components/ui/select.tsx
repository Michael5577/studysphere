import { cn } from "@/lib/utils";
import { type SelectHTMLAttributes, forwardRef } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-[var(--radius)] border bg-surface px-3 text-sm text-text",
          "transition-default focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-error focus-visible:outline-error/40"
            : "border-border focus-visible:border-primary/50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
