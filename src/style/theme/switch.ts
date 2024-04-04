import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  switchAnatomy.keys
);

const danger = definePartsStyle({
  track: {
    backgroundColor: colors.gray[450],
    _checked: {
      backgroundColor: colors.orange,
    },
  },
  thumb: {
    backgroundColor: "black",
  },
});

export const switchTheme = defineMultiStyleConfig({ variants: { danger } });
