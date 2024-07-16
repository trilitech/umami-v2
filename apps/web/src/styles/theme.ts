import { extendTheme } from "@chakra-ui/react";
import { type StyleFunctionProps, mode } from "@chakra-ui/theme-tools";

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
    lineHeight: "18px",
  },
  md: {
    fontSize: "16px",
    lineHeight: "22px",
  },
  lg: {
    fontSize: "18px",
  },
  xl: {
    fontSize: "20px",
  },
  "2xl": {
    fontSize: "24px",
    lineHeight: "32px",
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
  components: {
    Text: {
      sizes,
      variants: {
        bold: {
          fontWeight: "600",
          color: "gray.900",
        },
      },
    },
    Heading: {
      sizes: {
        sm: {
          fontSize: "16px",
          lineHeight: "22px",
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          color: "inherit",
          bg: "white",
          boxShadow: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
        },
      },
    },
    Input: {
      sizes: { md: { field: { height: "48px" } } },
      baseStyle: {
        element: {
          fontSize: "14px",
          width: "fit-content",
        },
      },
      defaultProps: { variant: "filled" },
      variants: {
        filled: {
          field: {
            padding: "16px",
            bg: "white",
            border: "1px solid",
            borderRadius: "6px",
            borderColor: "gray.300",
            _hover: {
              bg: "white",
            },
            _invalid: {
              borderColor: light.red,
            },
            _focusVisible: {
              borderColor: "gray.400",
            },
          },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontWeight: "600",
        color: "gray.900",
        marginBottom: "12px",
        size: "md",
      },
      sizes,
    },
    Tabs: {
      baseStyle: {
        tab: {
          _selected: {
            bg: "gray.200",
            color: "gray.900",
          },
        },
      },
    },
    Switch: {
      baseStyle: (props: StyleFunctionProps) => ({
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
      baseStyle: (props: StyleFunctionProps) => ({
        color: mode(light.grey[600], dark.grey[600])(props),
      }),
    },
    Button: {
      sizes: {
        md: { height: "42px", width: "42px", padding: "0 12px" },
        lg: { height: "48px", minWidth: "48px", padding: "0 12px" },
      },
      baseStyle: {
        borderRadius: "full",
        _disabled: {
          bg: "gray.100",
          color: "gray.300",
          opacity: 1,
        },
        _hover: {
          _disabled: {
            bg: "gray.100",
          },
        },
      },
      variants: {
        inputElement: {
          height: "28px",
          padding: "5px 12px",
          fontSize: "inherit",
          background: "gray.900",
          color: "white",
          width: "auto",
          minWidth: "fit-content",
          _hover: {
            bg: "gray.600",
          },
        },
        primary: {
          bg: light.blue,
          color: dark.grey.black,
          _hover: {
            bg: light.blueDark,
          },
        },
        secondary: {
          bg: "gray.900",
          color: "white",
          _hover: {
            bg: "gray.600",
          },
        },
        tertiary: {
          border: "2px solid",
          borderColor: light.blue,
          color: light.blue,
          _hover: {
            borderColor: light.blueDark,
            color: light.blueDark,
          },
          _dark: {
            color: dark.grey.black,
          },
        },
        iconButtonSolid: {
          bg: light.grey[100],
          color: light.grey[900],
          _hover: { bg: light.grey[200] },
          _dark: {
            bg: dark.grey[100],
            color: dark.grey[900],
            _hover: { bg: dark.grey[300] },
          },
        },
        iconButtonOutline: {
          border: "2px solid",
          borderColor: light.blue,
          color: light.blue,
          _hover: {
            borderColor: "transparent",
            bg: light.blueDark,
            color: dark.grey.black,
          },
          _dark: {
            color: dark.grey.black,
          },
        },
        empty: {
          bg: "transparent",
          minWidth: "auto",
          height: "auto",
        },
      },
    },
    Modal: {
      baseStyle: {
        closeButton: {
          bg: "transparent",
          color: "gray.400",
        },
        dialog: {
          borderTopRightRadius: "30px",
          borderTopLeftRadius: "30px",
          borderBottomRightRadius: { lg: "30px", base: 0 },
          borderBottomLeftRadius: { lg: "30px", base: 0 },
          bg: "white",
          padding: "36px",
          gap: "30px",
          marginBottom: {
            lg: "auto",
          },
          minWidth: {
            base: "100%",
            lg: "auto",
          },
        },
        header: {
          textAlign: "center",
          padding: 0,
          fontWeight: "600",
          color: "gray.900",
        },
        body: {
          padding: 0,
          justifyContent: "center",
          display: "flex",
        },
        footer: {
          padding: 0,
          justifyContent: "center",
        },
      },
    },
  },
  config,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: mode(light.grey[600], dark.grey[600])(props),
        bgColor: mode(light.bg, dark.bg)(props),
        bgImage: mode(light.bgGradient, dark.bgGradient)(props),
        _before: {
          bgColor: mode(light.bgMaskColor, dark.bgMaskColor)(props),
          maskImage: "url(/static/bg.svg)",
        },
      },
      ":root": {
        "--chakra-colors-black": mode(dark.grey.white, light.grey.white)(props),
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
        "--chakra-fontWeights-bold": 600,
      },
    }),
  },
});

export default theme;
