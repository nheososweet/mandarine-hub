/**
 * Color Configuration for Mandarine Hub
 * Using hex format for easier customization
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: "#f97316", // Orange-500
    primaryLight: "#fb923c", // Orange-400
    primaryDark: "#ea580c", // Orange-600
    primaryGlow: "rgba(249, 115, 22, 0.2)",
  },

  // Background Colors
  background: {
    primary: "#080010", // Deep space
    secondary: "#09090b", // Slightly lighter
    card: "rgba(24, 24, 27, 0.5)", // zinc-900/50
    hover: "rgba(255, 255, 255, 0.05)", // white/5
    active: "rgba(249, 115, 22, 0.1)", // orange/10
  },

  // Text Colors
  text: {
    primary: "#ffffff",
    secondary: "#a1a1aa", // zinc-400
    muted: "#71717a", // zinc-500
    disabled: "#52525b", // zinc-600
  },

  // Border Colors
  border: {
    default: "rgba(255, 255, 255, 0.1)", // white/10
    subtle: "rgba(255, 255, 255, 0.05)", // white/5
    active: "#f97316", // orange-500
  },

  // Chart Colors (for dashboard)
  chart: {
    orange: "#f97316", // Primary
    blue: "#3b82f6", // Blue-500
    purple: "#a855f7", // Purple-500
    green: "#22c55e", // Green-500
    red: "#ef4444", // Red-500
  },

  // Status Colors
  status: {
    success: "#22c55e",
    warning: "#eab308",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Semantic Colors
  semantic: {
    link: "#3b82f6",
    linkHover: "#60a5fa",
  },
} as const;

// CSS Variable mapping for Tailwind
export const cssVariables = {
  "--brand-primary": colors.brand.primary,
  "--brand-primary-light": colors.brand.primaryLight,
  "--brand-primary-dark": colors.brand.primaryDark,
  "--bg-primary": colors.background.primary,
  "--bg-secondary": colors.background.secondary,
  "--text-primary": colors.text.primary,
  "--text-secondary": colors.text.secondary,
  "--border-default": colors.border.default,
} as const;

export type ColorKey = keyof typeof colors;
export type ColorValue = (typeof colors)[ColorKey];
