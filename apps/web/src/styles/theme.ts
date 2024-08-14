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
    Accordion: {
      baseStyle: {
        panel: {
          padding: "10px 0",
        },
        button: {
          paddingY: "16px",
          borderBottomWidth: 0,
          _hover: {
            background: "gray.100",
          },
        },
        container: {
          _last: {
            borderBottomWidth: 0,
          },
        },
        icon: {
          width: "24px",
          height: "24px",
          color: "gray.500",
        },
      },
    },
    Text: { sizes },
    Heading: {
      sizes: {
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
          lineHeight: "24px",
        },
        xl: {
          fontSize: "20px",
          lineHeight: "26px",
        },
        "2xl": {
          fontSize: "24px",
          lineHeight: "32px",
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
        fontSize: "18px",
      },
      sizes,
    },
    Tabs: {
      baseStyle: {
        tab: {
          color: "gray.500",
          _selected: {
            _hover: {
              bg: "gray.200",
              color: "gray.900",
            },
            bg: "gray.200",
            color: "gray.900",
          },
          _hover: {
            bg: "gray.100",
            color: "gray.600",
          },
        },
      },
    },
    Radio: {
      baseStyle: {
        control: {
          width: "20px",
          height: "20px",
          _checked: {
            background: light.blue,
            borderColor: light.blue,
          },
          borderColor: "gray.400",
        },
        label: {
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
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
      variants: {
        dropdownOption: {
          display: "flex",
          justifyContent: "flex-start",
          width: "full",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          _hover: {
            background: "gray.100",
            textDecoration: "none",
          },
          rounded: "full",
        },
      },
    },
    Button: {
      sizes: {
        sm: { height: "30px", minWidth: "30px", padding: "6px" },
        md: { height: "42px", minWidth: "42px", padding: "0 12px" },
        lg: { height: "48px", minWidth: "48px", padding: "0 12px" },
      },
      defaultProps: {
        size: "lg",
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
          textDecoration: "none",
        },
      },
      variants: {
        dropdownOption: {
          display: "flex",
          justifyContent: "flex-start",
          width: "full",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          _hover: {
            background: "gray.100",
          },
          rounded: "full",
        },
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
        alert: {
          bg: light.red,
          color: dark.grey.black,
          _hover: {
            bg: light.redDark,
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
        auxiliary: {
          background: "none",
          borderRadius: "6px",
          alignItems: "center",
          gap: "4px",
          _hover: { background: "gray.100" },
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
        empty: {
          bg: "transparent",
          minWidth: "auto",
          height: "auto",
        },
      },
    },
    Popover: {
      baseStyle: {
        popper: {
          zIndex: 9999,
        },
      },
      variants: {
        dropdown: {
          content: {
            borderRadius: "30px",
            border: "1.5px solid",
            borderColor: "gray.100",
            bg: "white",
          },
          body: {
            boxShadow: "0px 0px 10px 0px rgba(45, 55, 72, 0.10)",
            padding: "12px",
            borderRadius: "30px",
          },
        },
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          background: "white",
          width: "100%",
          minWidth: {
            base: "100%",
            lg: "506px",
          },
        },
        header: {
          padding: { base: "12px", lg: "20px" },
        },
        body: {
          paddingTop: 0,
          paddingBottom: "20px",
          paddingX: { base: "12px", lg: "30px" },
        },
      },
    },
    Modal: {
      baseStyle: {
        closeButton: {
          bg: "transparent",
          color: "gray.400",
          width: "14px",
          height: "14px",
          marginRight: "10px",
          marginTop: "15px",
        },
        dialog: {
          borderTopRightRadius: "30px",
          borderTopLeftRadius: "30px",
          borderBottomRightRadius: { lg: "30px", base: 0 },
          borderBottomLeftRadius: { lg: "30px", base: 0 },
          background: "white",
          border: "1.5px solid",
          borderColor: "gray.100",
          padding: {
            base: "36px",
            lg: "42px",
          },
          marginBottom: {
            lg: "auto",
          },
          minWidth: {
            base: "100%",
            lg: "508px",
          },
          width: {
            lg: "508px",
          },
        },
        header: {
          textAlign: "center",
          padding: 0,
          color: "gray.900",
          marginBottom: "30px",
        },
        body: {
          padding: 0,
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          width: "full",
        },
        footer: {
          padding: 0,
          justifyContent: "center",
          marginTop: "30px",
        },
      },
    },
    Checkbox: {
      baseStyle: {
        label: {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflowX: "hidden",
          display: "inline-block",
          width: "100%",
        },
        control: {
          width: "15px",
          height: "15px",
          borderColor: "gray.300",
          _checked: {
            backgroundColor: "blue",
            border: "1px solid rgb(49, 130, 206)",
          },
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
