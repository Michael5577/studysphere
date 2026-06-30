"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { allNavItems } from "@/types/navigation";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setQuery("");
        setActiveIndex(0);
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return allNavItems;
    }

    return allNavItems.filter(
      (item) =>
        item.label.toLowerCase().includes(normalized) ||
        item.description?.toLowerCase().includes(normalized) ||
        item.href.toLowerCase().includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleOpenChange(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) =>
          index < results.length - 1 ? index + 1 : 0,
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) =>
          index > 0 ? index - 1 : results.length - 1,
        );
      }

      if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        handleOpenChange(false);
        router.push(results[activeIndex].href);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, results, activeIndex, router, handleOpenChange]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        handleOpenChange(!open);
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [open, handleOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-black/40"
        onClick={() => handleOpenChange(false)}
      />
      <Card
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        padding="none"
        className="relative z-10 w-full max-w-lg shadow-lg"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search pages…"
            className="border-0 bg-transparent px-0 shadow-none focus-visible:border-transparent"
            aria-label="Search pages"
          />
          <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted sm:inline">
            Esc
          </kbd>
        </div>

        <ul className="max-h-72 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center text-caption">
              No pages match your search.
            </li>
          ) : (
            results.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => handleOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 transition-default hover:bg-background focus-visible:bg-background focus-ring",
                    index === activeIndex && "bg-background",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0 text-muted" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text">{item.label}</p>
                    {item.description && (
                      <p className="truncate text-caption">{item.description}</p>
                    )}
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
