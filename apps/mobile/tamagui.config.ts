import { createTamagui } from "@tamagui/core";

import { shorthands, themes, tokens, typography } from "./styles";

export const tamaguiConfig = createTamagui({
  tokens,
  themes,
  shorthands,
  fonts: typography.fonts,

  media: {
    sm: { maxWidth: 860 },
    md: { maxWidth: 1024 },
    lg: { minWidth: 1025 },
    short: { maxHeight: 820 },
    tall: { minHeight: 821 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  },

  settings: {
    disableSSR: true,
  },
});

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
