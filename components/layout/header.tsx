"use client";

import { AppLogo } from "@/components/layout/app-logo";
import { useLandingSection } from "@/components/landing/landing-section-context";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Features", href: "#features", section: "features" as const },
  {
    label: "How it works",
    href: "#how-it-works",
    section: "how-it-works" as const,
  },
  { label: "Pricing", href: "#pricing", section: "pricing" as const },
];

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useLandingSection();

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  function navLinkClass(section: (typeof navLinks)[number]["section"]) {
    const isActive = activeSection === section;

    return cn(
      "relative rounded-full px-3 py-1.5 text-sm font-medium transition-default focus-ring touch-manipulation",
      isActive
        ? "bg-primary-muted text-primary shadow-[var(--shadow-subtle)]"
        : "text-muted hover:bg-muted-surface/80 hover:text-text",
    );
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] w-full px-4 pt-4 sm:px-6",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full border px-4 shadow-[var(--shadow-soft)] backdrop-blur-md transition-default sm:px-6",
          activeSection === "hero"
            ? "border-border/50 bg-surface/80"
            : "border-primary/15 bg-surface/95",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition-default hover:bg-muted-surface hover:text-text focus-ring touch-manipulation md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <Link href="/" className="group flex min-w-0 items-center gap-2.5">
            <AppLogo
              size={32}
              className="transition-transform group-hover:scale-105"
            />
            <span className="truncate font-serif text-lg font-semibold tracking-tight text-text">
              StudySphere
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={navLinkClass(link.section)}
              aria-current={activeSection === link.section ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className={buttonStyles({ variant: "ghost", size: "sm" })}
          >
            Log in
          </Link>
          <Link href="/signup" className={buttonStyles({ size: "sm" })}>
            Get started
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-3 max-w-6xl rounded-[2rem] border border-border/50 bg-surface/95 p-4 shadow-[var(--shadow-soft)] backdrop-blur-md md:hidden">
          <div className="mb-3 flex justify-end">
            <ThemeToggle showLabel />
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-[44px] items-center rounded-full px-4 py-2.5 text-sm font-medium transition-default touch-manipulation",
                  activeSection === link.section
                    ? "bg-primary-muted text-primary"
                    : "text-muted hover:bg-muted-surface hover:text-text",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border/50 pt-4">
            <Link
              href="/login"
              className={buttonStyles({
                variant: "outline",
                className: "w-full",
              })}
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={buttonStyles({ className: "w-full" })}
              onClick={() => setMobileOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
