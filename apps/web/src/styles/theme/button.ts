import { defineStyleConfig } from "@chakra-ui/react";

import colors from "../colors";

const baseCircle = {
  borderRadius: "full",
  bg: colors.grey[600],
  _disabled: {
    bg: colors.grey[700],
    color: colors.grey[400],
  },
  _hover: {
    color: colors.green,
    bg: colors.grey[500],
    _disabled: {
      bg: colors.grey[700],
      color: colors.grey[400],
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
        bg: colors.grey[500],
        color: colors.grey[400],
        opacity: 1,
      },
      _hover: {
        _disabled: {
          bg: colors.grey[500],
          color: colors.grey[400],
          opacity: 1,
        },
        bg: colors.blueDark,
      },
    },
    secondary: {
      border: "1px solid",
      borderColor: colors.green,
      _disabled: {
        color: colors.grey[400],
        borderColor: colors.grey[500],
        opacity: 1,
      },
      _hover: {
        bg: colors.green,
        _disabled: {
          color: colors.grey[400],
          borderColor: colors.grey[500],
          opacity: 1,
        },
      },
    },
    tertiary: {
      bg: "transparent",
      border: "1px solid",
      borderColor: colors.grey[500],
      _disabled: {
        color: colors.grey[400],
        opacity: 1,
      },
      _hover: {
        border: "1px solid",
        borderColor: colors.grey[600],
        bg: colors.grey[600],
        _disabled: {
          borderColor: colors.grey[500],
          color: colors.grey[400],
          opacity: 1,
        },
      },
    },
    warning: {
      bg: colors.red,
      _disabled: {
        bg: colors.grey[500],
        color: colors.grey[400],
        opacity: 1,
      },
      _hover: {
        bg: colors.redDark,
        _disabled: {
          bg: colors.grey[500],
          color: colors.grey[400],
          opacity: 1,
        },
      },
    },
    circle_without_hover_color: {
      ...baseCircle,
      _hover: {
        color: colors.green,
        _disabled: {
          bg: colors.grey[700],
          color: colors.grey[400],
        },
      },
    },
    circle_without_color: baseCircle,
    circle: {
      ...baseCircle,
      color: colors.grey[300],
    },
    specialCTA: {
      color: colors.greenDark,
      _hover: {
        color: colors.green,
      },
    },
    CTAWithIcon: {
      padding: "8px 7px",
      stroke: colors.grey[400],
      color: colors.grey[300],
      _hover: {
        color: colors.green,
        stroke: colors.green,
      },
      _disabled: {
        color: colors.grey[400],
      },
    },
    popover: {
      color: colors.grey[300],
      stroke: colors.grey[400],
      width: "100%",
      padding: 0,
      height: "24px",
      justifyContent: "end",
      _hover: {
        color: colors.green,
        stroke: colors.green,
      },
    },
    socialLogin: {
      width: "48px",
      height: "48px",
      background: "white",
      borderWidth: "0",
      borderRadius: "full",
      _loading: {
        color: "white",
        background: colors.grey[600],
        _hover: {
          background: colors.grey[600],
        },
      },
      _hover: {
        color: "white",
        background: colors.grey[600],
      },
    },
  },
  defaultProps: {
    variant: "primary",
    size: "md",
  },
});
