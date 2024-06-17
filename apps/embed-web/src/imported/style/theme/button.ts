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
      border: "1px solid",
      borderColor: colors.gray[500],
      _disabled: {
        color: colors.gray[450],
        opacity: 1,
      },
      _hover: {
        border: "1px solid",
        borderColor: colors.gray[600],
        bg: colors.gray[600],
        _disabled: {
          borderColor: colors.gray[500],
          color: colors.gray[450],
          opacity: 1,
        },
      },
    },
    popover: {
      color: colors.gray[300],
      stroke: colors.gray[450],
      width: "100%",
      padding: 0,
      height: "24px",
      justifyContent: "end",
      _hover: {
        color: colors.green,
        stroke: colors.green,
      },
    },
  },
  defaultProps: {
    variant: "primary",
    size: "md",
  },
});
