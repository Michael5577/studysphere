import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LucideIcon, Inbox } from "lucide-react";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-border bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-background text-muted">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-text">{title}</h3>
      <p className="mt-1.5 max-w-sm text-caption">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function EmptyStateAction({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return <Button onClick={onClick}>{children}</Button>;
}
