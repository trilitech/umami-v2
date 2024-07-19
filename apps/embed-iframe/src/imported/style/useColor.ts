import { useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { type CSSProperties, useCallback } from "react";

import { dark, light } from "./colors";

type ColorScheme = typeof light | typeof dark;
type GreyScale =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "450"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "black"
  | "white";
type Color = keyof Omit<ColorScheme, "grey">;
type ColorKey = Color | GreyScale | Exclude<CSSProperties["color"], undefined | null>;

export const useColor = () => {
  const colorMode = useColorMode();

  return useCallback(
    (_light: ColorKey, _dark?: ColorKey): string => {
      const lightValue = light.grey[_light as GreyScale] || light[_light as Color] || _light;
      const darkValue = _dark
        ? dark.grey[_dark as GreyScale] || dark[_dark as Color] || _dark
        : dark.grey[_light as GreyScale] || dark[_light as Color] || _light;

      console.log(lightValue, darkValue, colorMode);

      return mode(lightValue, darkValue)(colorMode);
    },
    [colorMode]
  );
};
