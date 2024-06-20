import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  switchAnatomy.keys
);

const danger = definePartsStyle({
  track: {
    backgroundColor: colors.grey[400],
    _checked: {
      backgroundColor: colors.red,
    },
  },
  thumb: {
    backgroundColor: "black",
  },
});

export const switchTheme = defineMultiStyleConfig({ variants: { danger } });
