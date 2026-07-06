import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground border border-transparent shadow-[var(--shadow-soft)] hover:bg-primary-hover hover:shadow-[0_6px_24px_-4px_rgba(93,112,82,0.25)]",
  secondary:
    "bg-secondary text-secondary-foreground border border-transparent shadow-[var(--shadow-soft)] hover:brightness-105",
  outline:
    "border-2 border-secondary bg-transparent text-secondary hover:bg-secondary/10",
  ghost:
    "text-primary border border-transparent hover:bg-primary-muted",
  danger:
    "bg-error/10 text-error border border-transparent hover:bg-error/15",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-sm gap-1.5",
  md: "h-12 px-6 text-sm gap-2",
  lg: "h-14 px-8 text-base gap-2",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-default focus-ring touch-manipulation",
    "hover:scale-[1.02] active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50 disabled:scale-100",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={buttonStyles({ variant, size, className })}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
