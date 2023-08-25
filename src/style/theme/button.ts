import { defineStyleConfig } from "@chakra-ui/react";
import colors from "../colors";

export const buttonTheme = defineStyleConfig({
  sizes: { md: { height: "38px" }, lg: { height: "48px" } },
  variants: {
    primary: {
      bg: colors.blue,
      _disabled: {
        bg: colors.gray[500],
        color: colors.gray[450],
      },
      _hover: {
        _disabled: {
          bg: colors.gray[500],
          color: colors.gray[450],
        },
        bg: colors.blueL,
      },
    },
    secondary: {
      border: "1px solid",
      borderColor: colors.green,
      _disabled: {
        color: colors.gray[450],
        borderColor: colors.gray[500],
      },
      _hover: {
        bg: colors.green,
        _disabled: {
          color: colors.gray[450],
          borderColor: colors.gray[500],
        },
      },
    },
    tertiary: {
      bg: "transparent",
      border: "1px solid",
      borderColor: colors.gray[500],
      _disabled: {
        color: colors.gray[450],
      },
      _hover: {
        border: "1px solid",
        borderColor: colors.gray[600],
        bg: colors.gray[600],
        _disabled: {
          borderColor: colors.gray[500],
        },
      },
    },
    warning: {
      bg: colors.orange,
      _disabled: {
        bg: colors.gray[500],
        color: colors.gray[450],
      },
      _hover: {
        bg: colors.orangeL,
        _disabled: {
          bg: colors.gray[500],
          color: colors.gray[450],
        },
      },
    },
    circle: {
      width: "38px",
      borderRadius: "full",
      color: colors.gray[300],
      bg: colors.gray[600],
      _disabled: {
        bg: colors.gray[700],
        color: colors.gray[450],
      },
      _hover: {
        color: colors.green,
        bg: colors.gray[500],
        _disabled: {
          bg: colors.gray[700],
          color: colors.gray[450],
        },
      },
    },
  },
  defaultProps: {
    variant: "primary",
    size: "md",
  },
});
