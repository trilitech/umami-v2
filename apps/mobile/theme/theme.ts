import * as Colors from "@tamagui/colors";
import { createThemes } from "@tamagui/theme-builder";

import { colors } from "./colours";

const lightShadows = {
  shadow1: "rgba(0,0,0,0.04)",
  shadow2: "rgba(0,0,0,0.08)",
  shadow3: "rgba(0,0,0,0.16)",
  shadow4: "rgba(0,0,0,0.24)",
  shadow5: "rgba(0,0,0,0.32)",
  shadow6: "rgba(0,0,0,0.4)",
};

const darkShadows = {
  shadow1: "rgba(0,0,0,0.2)",
  shadow2: "rgba(0,0,0,0.3)",
  shadow3: "rgba(0,0,0,0.4)",
  shadow4: "rgba(0,0,0,0.5)",
  shadow5: "rgba(0,0,0,0.6)",
  shadow6: "rgba(0,0,0,0.7)",
};

const builtThemes = createThemes({
  base: {
    palette: {
      dark: colors.dark,
      light: colors.light,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: colors.dark,
      light: colors.light,
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: [colors.dark[9]],
        light: [colors.light[9]],
      },
    },

    error: {
      palette: {
        dark: [colors.dark[10]],
        light: [colors.light[10]],
      },
    },

    success: {
      palette: {
        dark: [colors.dark[8]],
        light: [colors.light[8]],
      },
    },
  },
});

export type Themes = typeof builtThemes;

export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === "client" &&
  process.env.NODE_ENV === "production"
    ? ({} as any)
    : (builtThemes as any);
