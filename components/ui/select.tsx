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
          "block h-12 w-full min-w-0 max-w-full rounded-full border bg-white/60 px-4 text-base text-text sm:h-10 sm:text-sm",
          "[-webkit-appearance:none] appearance-none transition-default focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-error"
            : "border-border focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20",
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
