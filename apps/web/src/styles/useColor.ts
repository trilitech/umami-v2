import { useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { useCallback } from "react";

import { dark, light } from "./colors";

export const useColor = () => {
  const colorMode = useColorMode();

  return useCallback(
    (_light: keyof typeof light.grey, _dark?: keyof typeof dark.grey) =>
      mode(light.grey[_light], dark.grey[_dark || _light])(colorMode),
    [colorMode]
  );
};
