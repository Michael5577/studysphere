/**
 * StudySphere design tokens — single source of truth for JS/TS usage.
 * CSS custom properties in app/globals.css mirror these values.
 */

export const colors = {
  primary: "#4648d4",
  primaryHover: "#3a3cb8",
  primaryMuted: "#ededfc",
  background: "#fcf9f8",
  surface: "#ffffff",
  border: "#e2e8f0",
  text: "#1c1b1b",
  muted: "#464554",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
} as const;

export const typography = {
  fontSans: "var(--font-geist-sans)",
  fontMono: "var(--font-geist-mono)",
  sizes: {
    xs: "0.75rem", // 12px — captions, metadata
    sm: "0.8125rem", // 13px — UI labels, nav items
    base: "0.875rem", // 14px — body (Linear-style density)
    lg: "1rem", // 16px — emphasized body
    xl: "1.125rem", // 18px — section titles
    "2xl": "1.5rem", // 24px — page titles
    "3xl": "1.875rem", // 30px — hero headings
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
  },
  tracking: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.04em",
    label: "0.06em",
  },
} as const;

/** 4px base grid — use Tailwind spacing scale (1 = 4px) */
export const spacing = {
  page: "1.5rem", // 24px — mobile page padding
  pageLg: "2rem", // 32px — desktop page padding
  section: "2rem", // 32px — between sections
  sectionLg: "3rem", // 48px — large section gaps
  card: "1.25rem", // 20px — card internal padding
  stack: "0.75rem", // 12px — stacked item gap
  stackLg: "1rem", // 16px — larger stack gap
} as const;

export const radius = {
  /** Single radius used across the entire application */
  default: "0.5rem", // 8px
} as const;

export const containers = {
  app: "72rem", // 1152px — max app content width
  narrow: "40rem", // 640px — forms, settings
  prose: "48rem", // 768px — readable text blocks
} as const;

export const shadows = {
  /** Restrained — borders preferred over shadows */
  none: "none",
  subtle: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
} as const;

export const motion = {
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  duration: {
    fast: "150ms",
    normal: "200ms",
  },
} as const;

export const layout = {
  sidebarWidth: "15rem", // 240px
  topNavHeight: "3.5rem", // 56px
  mobileNavHeight: "4rem", // 64px
} as const;

export const iconSizes = {
  sm: 16,
  md: 18,
  lg: 20,
} as const;
