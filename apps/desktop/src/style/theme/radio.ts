import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  radioAnatomy.keys
);

const primary = definePartsStyle({
  control: {
    height: "16px",
    width: "16px",
    _dark: {
      borderColor: colors.gray[400],
    },
    _checked: {
      backgroundColor: colors.green,
      borderColor: colors.green,
      border: "none",
      color: "white",
    },
  },
});

export const radioTheme = defineMultiStyleConfig({ variants: { primary } });
