"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LandingSectionId = "hero" | "features" | "how-it-works" | "pricing";

const LandingSectionContext = createContext<LandingSectionId>("hero");

export function useLandingSection() {
  return useContext(LandingSectionContext);
}

const SECTION_IDS: LandingSectionId[] = [
  "hero",
  "features",
  "how-it-works",
  "pricing",
];

interface LandingSectionProviderProps {
  children: ReactNode;
}

export function LandingSectionProvider({ children }: LandingSectionProviderProps) {
  const [activeSection, setActiveSection] =
    useState<LandingSectionId>("hero");

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as LandingSectionId);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.55],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <LandingSectionContext.Provider value={activeSection}>
      {children}
    </LandingSectionContext.Provider>
  );
}
