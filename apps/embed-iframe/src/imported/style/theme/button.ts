import { defineStyleConfig } from "@chakra-ui/react";

import colors from "../colors";

export const buttonTheme = defineStyleConfig({
  sizes: {
    md: { height: "38px", fontSize: "14px", minWidth: "38px" },
    lg: { height: "48px", fontSize: "16px", minWidth: "48px" },
  },
  variants: {
    primary: {
      bg: "transparent",
      border: "1.5px solid",
      borderColor: colors.grey[100],
      _hover: {
        border: "1.5px solid",
        borderColor: colors.grey[100],
        bg: colors.grey[100],
      },
    },
  },
  defaultProps: {
    variant: "primary",
    size: "md",
  },
});
