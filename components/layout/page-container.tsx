import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "full";
}

const sizeStyles = {
  default: "max-w-[var(--container-content)]",
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
        "page-container-compact mx-auto w-full min-w-0 max-w-full px-4 py-4 safe-area-x sm:px-5 sm:py-5 lg:py-6",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
