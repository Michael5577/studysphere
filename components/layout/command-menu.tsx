"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { allNavItems } from "@/types/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Plus,
  Search,
  Sparkles,
  Timer,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
  run: () => void;
}

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenAssistant?: () => void;
}

export function CommandMenu({
  open,
  onOpenChange,
  onOpenAssistant,
}: CommandMenuProps) {
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

  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        id: "ai-assistant",
        label: "Ask StudySphere AI",
        description: "Open the academic assistant",
        icon: Sparkles,
        keywords: ["ai", "assistant", "chat", "help"],
        run: () => {
          handleOpenChange(false);
          onOpenAssistant?.();
        },
      },
      {
        id: "plan-my-day",
        label: "Plan my day",
        description: "Generate today's study plan",
        icon: LayoutDashboard,
        keywords: ["plan", "today", "prioritize", "insights"],
        run: () => {
          handleOpenChange(false);
          router.push("/dashboard#plan-my-day");
        },
      },
      {
        id: "start-focus",
        label: "Start focus session",
        description: "Jump to the focus timer",
        icon: Timer,
        keywords: ["focus", "pomodoro", "timer", "study"],
        run: () => {
          handleOpenChange(false);
          router.push("/focus");
        },
      },
      {
        id: "new-assignment",
        label: "New assignment",
        description: "Create a task quickly",
        icon: Plus,
        keywords: ["assignment", "task", "new", "create"],
        run: () => {
          handleOpenChange(false);
          router.push("/assignments?new=1");
        },
      },
      {
        id: "analytics",
        label: "View analytics",
        description: "Focus trends and workload",
        icon: BarChart3,
        keywords: ["analytics", "stats", "trends", "streak"],
        run: () => {
          handleOpenChange(false);
          router.push("/analytics");
        },
      },
    ],
    [handleOpenChange, onOpenAssistant, router],
  );

  const navResults = useMemo(() => {
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

  const actionResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return quickActions;
    }

    return quickActions.filter(
      (action) =>
        action.label.toLowerCase().includes(normalized) ||
        action.description.toLowerCase().includes(normalized) ||
        action.keywords.some((keyword) => keyword.includes(normalized)),
    );
  }, [query, quickActions]);

  const flatResults = useMemo(
    () => [
      ...actionResults.map((item, index) => ({
        type: "action" as const,
        item,
        index,
      })),
      ...navResults.map((item, index) => ({
        type: "nav" as const,
        item,
        index: actionResults.length + index,
      })),
    ],
    [actionResults, navResults],
  );

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
          index < flatResults.length - 1 ? index + 1 : 0,
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) =>
          index > 0 ? index - 1 : flatResults.length - 1,
        );
      }

      if (event.key === "Enter" && flatResults[activeIndex]) {
        event.preventDefault();
        const selected = flatResults[activeIndex];

        if (selected.type === "action") {
          selected.item.run();
          return;
        }

        handleOpenChange(false);
        router.push(selected.item.href);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, flatResults, activeIndex, router, handleOpenChange]);

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
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[max(1rem,var(--safe-area-top))] sm:pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-black/40"
        onClick={() => handleOpenChange(false)}
      />
      <Card
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
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
            placeholder="Search pages and actions…"
            className="border-0 bg-transparent px-0 shadow-none focus-visible:border-transparent"
            aria-label="Search pages and actions"
          />
          <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted sm:inline">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {flatResults.length === 0 ? (
            <p className="px-4 py-6 text-center text-caption">
              No matches found.
            </p>
          ) : (
            <>
              {actionResults.length > 0 && (
                <section>
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Quick actions
                  </p>
                  <ul>
                    {actionResults.map((action, actionIndex) => (
                      <li key={action.id}>
                        <button
                          type="button"
                          onClick={action.run}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-default hover:bg-background focus-ring",
                            actionIndex === activeIndex && "bg-background",
                          )}
                        >
                          <action.icon className="h-4 w-4 shrink-0 text-primary" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text">
                              {action.label}
                            </p>
                            <p className="truncate text-caption">
                              {action.description}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {navResults.length > 0 && (
                <section className={actionResults.length > 0 ? "mt-2" : undefined}>
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Pages
                  </p>
                  <ul>
                    {navResults.map((item, navIndex) => {
                      const index = actionResults.length + navIndex;

                      return (
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
                              <p className="text-sm font-medium text-text">
                                {item.label}
                              </p>
                              {item.description && (
                                <p className="truncate text-caption">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
