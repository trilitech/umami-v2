import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

import { dark, light } from "./colors";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const sizes = {
  xs: {
    fontSize: "12px",
  },
  sm: {
    fontSize: "14px",
  },
  md: {
    fontSize: "16px",
  },
  lg: {
    fontSize: "18px",
  },
  xl: {
    fontSize: "20px",
  },
  "2xl": {
    fontSize: "24px",
  },
  "3xl": {
    fontSize: "30px",
  },
  "4xl": {
    fontSize: "36px",
  },
  "5xl": {
    fontSize: "48px",
  },
  "6xl": {
    fontSize: "69px",
  },
};

const theme = extendTheme({
  // semanticTokens: {
  //   colors: {
  //     text: {
  //       default: "green",
  //       _dark: "red",
  //     },
  //   },
  // },
  components: {
    Text: {
      sizes,
    },
    Heading: {
      baseStyle: {
        fontWeight: "600",
        fontFamily: "Inter",
      },
      sizes,
    },
    Card: {
      // container: {
      baseStyle: {
        container: {
          bg: "var(--chakra-colors-white)",
          boxShadow: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
        },
      },
      // },
    },
    Input: props => ({
      sizes: { md: { field: { height: "48px" } } },
      defaultProps: { variant: "filled" },
      variants: {
        filled: {
          field: {
            bg: mode(light.grey[800], dark.grey[800])(props),
            border: "1px solid",
            borderColor: mode(light.grey[500], dark.grey[500])(props),
            _invalid: {
              borderColor: light.red,
            },
            _hover: {
              bg: mode(light.grey[800], dark.grey[800])(props),
            },
            _focusVisible: {
              bg: mode(light.grey[800], dark.grey[800])(props),
              borderColor: mode(light.grey[400], dark.grey[400])(props),
            },
          },
        },
      },
    }),
    FormLabel: {
      baseStyle: {
        fontWeight: "600",
        marginBottom: "12px",
        size: "md",
      },
      sizes,
    },
    Tabs: {
      baseStyle: {
        tab: {
          color: "var(--chakra-colors-gray-500)",
          _selected: {
            bg: "var(--chakra-colors-gray-200)",
            color: "var(--chakra-colors-gray-900)",
          },
        },
      },
    },
    Switch: {
      baseStyle: props => ({
        track: {
          backgroundColor: mode(light.grey[300], dark.grey[300])(props),
          _checked: {
            backgroundColor: mode(light.grey[400], dark.grey[400])(props),
          },
        },
        thumb: {
          backgroundColor: mode(light.grey.white, dark.grey.white)(props),
        },
      }),
    },
    Link: {
      baseStyle: props => ({
        color: mode(light.grey[600], dark.grey[600])(props),
      }),
    },
  },
  config,
  colors: {
    text: {
      default: "green",
    },
  },
  styles: {
    global: props => ({
      body: {
        bg: mode(light.bg, dark.bg)(props),
        bgImage: mode(light.bgGradient, dark.bgGradient)(props),
        _before: {
          bg: mode(light.bgMaskColor, dark.bgMaskColor)(props),
          maskImage: "url(src/assets/bg.svg)",
        },
      },
      ":root": {
        "--chakra-colors-white": mode(light.grey.white, dark.grey.white)(props),
        "--chakra-colors-gray-50": mode(light.grey[50], dark.grey[50])(props),
        "--chakra-colors-gray-100": mode(light.grey[100], dark.grey[100])(props),
        "--chakra-colors-gray-200": mode(light.grey[200], dark.grey[200])(props),
        "--chakra-colors-gray-300": mode(light.grey[300], dark.grey[300])(props),
        "--chakra-colors-gray-400": mode(light.grey[400], dark.grey[400])(props),
        "--chakra-colors-gray-500": mode(light.grey[500], dark.grey[500])(props),
        "--chakra-colors-gray-600": mode(light.grey[600], dark.grey[600])(props),
        "--chakra-colors-gray-700": mode(light.grey[700], dark.grey[700])(props),
        "--chakra-colors-gray-800": mode(light.grey[800], dark.grey[800])(props),
        "--chakra-colors-gray-900": mode(light.grey[900], dark.grey[900])(props),
      },
    }),
  },
});
export default theme;
