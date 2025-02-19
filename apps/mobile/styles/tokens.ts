import { createTokens } from "@tamagui/core";

export const tokens = createTokens({
  size: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 32,
    xxl: 48,
  },
  space: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 32,
    xxl: 48,
  },
  radius: {
    none: 0,
    sm: 3,
    md: 6,
    lg: 12,
    xl: 24,
    xxl: 48, // Ensure this exists!
  },
  color: {
    white: "#ffffff",
    black: "#000000",
    gray100: "#f7fafc",
    gray200: "#edf2f7",
    gray300: "#e2e8f0",
    gray400: "#cbd5e0",
    gray500: "#a0aec0",
    gray600: "#718096",
    gray700: "#4a5568",
    gray800: "#2d3748",
    gray900: "#1a202c",
    primary: "#007AFF",
    secondary: "#34C759",
    danger: "#FF3B30",
    warning: "#FFCC00",
    success: "#4CD964",
  },
});
