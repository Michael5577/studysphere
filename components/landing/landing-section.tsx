"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLandingSection } from "./landing-section-context";

type SectionTone = "hero" | "features" | "steps" | "pricing";

const toneStyles: Record<
  SectionTone,
  { section: string; active: string; glow?: string }
> = {
  hero: {
    section: "bg-background",
    active: "landing-section-active-hero",
    glow: "from-primary/10 via-transparent to-secondary/10",
  },
  features: {
    section:
      "border-t border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--muted-surface)_85%,var(--background))_0%,var(--background)_100%)]",
    active: "landing-section-active-features",
  },
  steps: {
    section: "bg-background",
    active: "landing-section-active-steps",
    glow: "from-primary/8 via-accent/20 to-transparent",
  },
  pricing: {
    section:
      "border-t border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary-muted)_45%,var(--background))_0%,var(--background)_55%,color-mix(in_srgb,var(--muted-surface)_70%,var(--background))_100%)]",
    active: "landing-section-active-pricing",
  },
};

const toneToSectionId: Record<SectionTone, string> = {
  hero: "hero",
  features: "features",
  steps: "how-it-works",
  pricing: "pricing",
};

interface LandingSectionProps {
  id: string;
  tone: SectionTone;
  className?: string;
  children: ReactNode;
}

export function LandingSection({
  id,
  tone,
  className,
  children,
}: LandingSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const activeSection = useLandingSection();
  const isActive = activeSection === toneToSectionId[tone];

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const styles = toneStyles[tone];

  return (
    <section
      id={id}
      ref={ref}
      data-active={isActive ? "true" : "false"}
      className={cn(
        "landing-section relative overflow-hidden scroll-mt-28 transition-[background-color,box-shadow] duration-700",
        styles.section,
        visible && "landing-section-visible",
        isActive && styles.active,
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700",
          "bg-[radial-gradient(circle_at_30%_20%,rgba(93,112,82,0.12),transparent_50%)]",
          isActive && "opacity-100",
        )}
        aria-hidden
      />
      {styles.glow && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(93,112,82,0.08),transparent_55%)] opacity-0 transition-opacity duration-700",
            visible && "opacity-100",
          )}
          aria-hidden
        />
      )}
      <div
        className={cn(
          "relative transition-all duration-700 ease-out",
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0",
        )}
      >
        {children}
      </div>
    </section>
  );
}
