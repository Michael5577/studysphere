import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  eyebrow?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-label">{eyebrow}</p>}
        <h2 className="text-display text-xl sm:text-2xl">{title}</h2>
        {description && (
          <p className="mt-1.5 text-caption">{description}</p>
        )}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
}
