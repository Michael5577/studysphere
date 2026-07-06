/**
 * StudySphere design tokens — organic / natural system.
 * CSS custom properties in app/globals.css mirror these values.
 */

export const colors = {
  background: "#FDFCF8",
  foreground: "#2C2C24",
  surface: "#FEFEFA",
  primary: "#5D7052",
  primaryHover: "#4D6344",
  primaryForeground: "#F3F4F1",
  primaryMuted: "#E8EDE5",
  secondary: "#C18C5D",
  secondaryForeground: "#FFFFFF",
  accent: "#E6DCCD",
  accentForeground: "#4A4A40",
  muted: "#78786C",
  mutedSurface: "#F0EBE5",
  border: "#DED8CF",
  success: "#5D7052",
  warning: "#C18C5D",
  error: "#A85448",
} as const;

export const typography = {
  fontSans: "var(--font-nunito)",
  fontSerif: "var(--font-fraunces)",
  sizes: {
    xs: "0.75rem",
    sm: "0.8125rem",
    base: "0.9375rem",
    lg: "1rem",
    xl: "1.125rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },
} as const;

export const radius = {
  default: "1rem",
  lg: "1.5rem",
  pill: "9999px",
} as const;

export const shadows = {
  subtle: "0 1px 2px rgb(93 112 82 / 0.04)",
  soft: "0 4px 20px -2px rgb(93 112 82 / 0.15)",
  float: "0 10px 40px -10px rgb(193 140 93 / 0.2)",
} as const;

export const motion = {
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  duration: {
    fast: "200ms",
    normal: "300ms",
  },
} as const;

export const layout = {
  sidebarWidth: "15rem",
  topNavHeight: "3.5rem",
  mobileNavHeight: "4rem",
} as const;
