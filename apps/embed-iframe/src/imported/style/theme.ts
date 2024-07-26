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
  components: {
    Text: {
      baseStyle: (props: StyleFunctionProps) => ({
        fontWeight: "400",
        fontFamily: "Inter",
        color: mode(light.grey[900], dark.grey[900])(props),
      }),
      sizes,
    },
    Heading: {
      baseStyle: (props: StyleFunctionProps) => ({
        fontWeight: "600",
        fontFamily: "Inter",
        color: mode(light.grey[900], dark.grey[900])(props),
      }),
      sizes,
    },
    Button: {
      sizes: {
        md: { height: "38px", fontSize: "14px", minWidth: "38px" },
        lg: { height: "48px", fontSize: "16px", minWidth: "48px" },
      },
      variants: {
        primary: (props: StyleFunctionProps) => ({
          bg: mode(light.grey.white, dark.grey.white)(props),
          border: "1.5px solid",
          borderColor: mode(light.grey[100], dark.grey[100])(props),
          _hover: {
            border: "1.5px solid",
            borderColor: mode(light.grey[100], dark.grey[100])(props),
            bg: mode(light.grey[100], dark.grey[100])(props),
          },
        }),
      },
      defaultProps: {
        variant: "primary",
        size: "md",
      },
    },
    Modal: {
      baseStyle: (props: StyleFunctionProps) => ({
        dialog: {
          padding: "36px 42px",
          bg: mode(light.grey.white, dark.grey.white)(props),
          border: "1.5px solid",
          borderColor: mode(light.grey[100], dark.grey[100])(props),
          borderRadius: "30px",
          boxShadow: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
        },
        closeButton: {
          top: "10px",
          position: "absolute" as const,
          color: mode(light.grey[400], dark.grey[400])(props),
          borderRadius: "18px",
          insetEnd: "10px",
        },
        body: {
          padding: 0,
        },
        footer: {
          padding: "32px 0 0 0",
        },
        header: {
          padding: 0,
        },
      }),
      sizes: { md: { dialog: { maxW: "384px" } } },
    },
  },
  config,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        background: "rgba(16, 18, 27, 0.85)",
        backdropFilter: "blur(5px)",
        fontFamily: "Inter",
        color: mode(light.grey[900], dark.grey[900])(props),
        minWidth: "300px",
        minHeight: "100vh",
        display: "flex",
        margin: 0,
        placeItems: "center",
      },
      ":root": {
        "--chakra-colors-gray-black": mode(light.grey.black, dark.grey.black)(props),
        "--chakra-colors-gray-white": mode(light.grey.white, dark.grey.white)(props),
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
        "--chakra-colors-chakra-body-bg": "",
        "--chakra-colors-chakra-subtle-bg": "",
      },
    }),
  },
});

export default theme;
