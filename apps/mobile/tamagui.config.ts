import { createTamagui } from "tamagui";

import { shorthands, themes, tokens, typography } from "./theme";

export const tamaguiConfig = createTamagui({
  themes,
  tokens,
  shorthands,
  fonts: typography.fonts,
});

export type AppTamaguiConfig = typeof tamaguiConfig;
