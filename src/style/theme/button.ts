import { defineStyleConfig } from "@chakra-ui/react";

import colors from "../colors";

const baseCircle = {
  borderRadius: "full",
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
};

export const buttonTheme = defineStyleConfig({
  sizes: {
    md: { height: "38px", fontSize: "14px", minWidth: "38px" },
    lg: { height: "48px", fontSize: "16px", minWidth: "48px" },
  },
  variants: {
    primary: {
      bg: colors.blue,
      _disabled: {
        bg: colors.gray[500],
        color: colors.gray[450],
        opacity: 1,
      },
      _hover: {
        _disabled: {
          bg: colors.gray[500],
          color: colors.gray[450],
          opacity: 1,
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
        opacity: 1,
      },
      _hover: {
        bg: colors.green,
        _disabled: {
          color: colors.gray[450],
          borderColor: colors.gray[500],
          opacity: 1,
        },
      },
    },
    tertiary: {
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
    warning: {
      bg: colors.orange,
      _disabled: {
        bg: colors.gray[500],
        color: colors.gray[450],
        opacity: 1,
      },
      _hover: {
        bg: colors.orangeL,
        _disabled: {
          bg: colors.gray[500],
          color: colors.gray[450],
          opacity: 1,
        },
      },
    },
    circle_without_color: baseCircle,
    circle: {
      ...baseCircle,
      color: colors.gray[300],
    },
    specialCTA: {
      color: colors.greenL,
      _hover: {
        color: colors.green,
      },
    },
    CTAWithIcon: {
      padding: "8px 7px",
      color: colors.gray[300],
      _hover: {
        color: colors.green,
      },
      _disabled: {
        color: colors.gray[450],
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
