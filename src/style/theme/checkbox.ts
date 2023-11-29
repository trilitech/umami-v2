import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

import colors from "../colors";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  checkboxAnatomy.keys
);

const baseStyle = definePartsStyle({
  icon: {
    color: "white",
  },
  control: {
    marginTop: "-20px",
    width: "20px",
    height: "20px",
    borderWidth: "2px",
    borderColor: colors.gray[400],
    borderRadius: "2px",
    _checked: {
      borderColor: colors.green,
      bg: colors.green,
      color: colors.white,

      _hover: {
        bg: colors.green,
        borderColor: colors.green,
      },
    },
  },
});

export const checkboxTheme = defineMultiStyleConfig({ baseStyle });
