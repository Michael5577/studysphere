"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface PopoverProps {
  trigger: (props: {
    open: boolean;
    onToggle: () => void;
    panelId: string;
  }) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
  contentClassName?: string;
  label: string;
}

export function Popover({
  trigger,
  children,
  align = "right",
  className,
  contentClassName,
  label,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {trigger({
        open,
        onToggle: () => setOpen((value) => !value),
        panelId,
      })}

      {open && (
        <div
          id={panelId}
          role="menu"
          aria-label={label}
          className={cn(
            "absolute top-full z-[70] mt-1.5 min-w-48 rounded-[var(--radius-lg)] border border-border bg-surface py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
            contentClassName,
          )}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest("button, a")) {
              setOpen(false);
            }
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function PopoverLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-sm text-text transition-default hover:bg-background focus-visible:bg-background focus-ring",
        className,
      )}
    >
      {children}
    </Link>
  );
}
