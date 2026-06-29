import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "full";
}

const sizeStyles = {
  default: "max-w-[var(--container-app)]",
  narrow: "max-w-[var(--container-narrow)]",
  full: "max-w-none",
};

export function PageContainer({
  className,
  size = "default",
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6 lg:px-8",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
