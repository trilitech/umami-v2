import { createFont } from "@tamagui/core";

export const typography = {
  fonts: {
    heading: createFont({
      family: "Poppins-Bold",
      size: {
        xxs: 12,
        xs: 14,
        sm: 18,
        md: 22,
        lg: 26,
        xl: 32,
        xxl: 40,
      },
      lineHeight: {
        xxs: 1.2,
        xs: 1.3,
        sm: 1.4,
        md: 1.5,
        lg: 1.6,
        xl: 1.8,
        xxl: 2,
      },
      weight: {
        400: "400",
        500: "500",
        600: "600",
        700: "700",
        800: "800",
      },
      letterSpacing: {
        sm: 0,
        md: -0.25,
        lg: -0.5,
      },
    }),

    body: createFont({
      family: "Poppins-Regular",
      size: {
        xxs: 10,
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
      },
      lineHeight: {
        xxs: 1.3,
        xs: 1.4,
        sm: 1.5,
        md: 1.6,
        lg: 1.7,
        xl: 1.8,
        xxl: 2,
      },
      weight: {
        300: "300",
        400: "400",
        500: "500",
        600: "600",
        700: "700",
      },
      letterSpacing: {
        sm: 0.1,
        md: 0.2,
      },
    }),

    mono: createFont({
      family: "Courier New",
      size: {
        sm: 12,
        md: 14,
        lg: 16,
      },
      lineHeight: {
        sm: 1.3,
        md: 1.4,
        lg: 1.5,
      },
      weight: {
        400: "400",
        500: "500",
        600: "600",
        700: "700",
      },
      letterSpacing: {
        sm: 0,
        md: 0.25,
      },
    }),
  },
};
