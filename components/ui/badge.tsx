import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-muted-surface text-muted",
  primary: "bg-primary-muted text-primary",
  success: "bg-primary-muted text-primary",
  warning: "bg-accent text-accent-foreground",
  error: "bg-error/10 text-error",
  outline: "bg-surface text-muted border border-border/60",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-label",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
