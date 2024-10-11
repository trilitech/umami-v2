import { extendTheme } from "@chakra-ui/react";
import { type StyleFunctionProps, mode } from "@chakra-ui/theme-tools";

import { dark, light } from "./colors";

const config = {
  initialColorMode: "dark",
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
      variants: {
        onboarding: {
          button: {
            justifyContent: "center",
            height: "60px",
            padding: "6px 5px",
            background: "none",
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderColor: "gray.100",
            borderRadius: "70px",
            _hover: { background: "none" },
          },
          panel: {
            padding: "6px",
          },
        },
      },
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
        "3xl": {
          fontSize: "30px",
          lineHeight: "36px",
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
        mnemonic: {
          field: {
            borderRadius: "34px",
            height: { md: "48px", base: "34px" },
            border: "1px solid",
            background: "none",
            borderColor: "gray.100",
            fontSize: { md: "18px", base: "12px" },
            paddingLeft: { base: "30px", md: "50px" },
            paddingRight: "10px",
            _placeholder: {
              color: "gray.400",
            },
            color: "black",
          },
        },
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
    List: {
      variants: {
        suggestions: {
          item: {
            _hover: {
              background: "gray.400",
            },
            background: "gray.200",
            borderRadius: "4px",
            cursor: "pointer",
            height: "30px",
            listStyleType: "none",
          },
          container: {
            background: "gray.200",
            border: "1px solid",
            borderColor: "gray.100",
            borderRadius: "8px",
            listStyleType: "none",
            maxHeight: "230px",
            width: "200px",
            marginLeft: "0 !important",
            overflowX: "hidden",
            padding: "10px",
            position: "absolute",
            zIndex: 2,
          },
        },
        explanation: {
          item: {
            display: "flex",
            gap: "10px",
            borderRadius: "6px",
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "gray.100",
            color: "gray.500",
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
      baseStyle: (props: StyleFunctionProps) => ({
        tablist: {
          color: "gray.500",
        },
        tab: {
          color: "gray.500",
          _selected: {
            _hover: {
              bg: mode("gray.200", "gray.100")(props),
              color: "gray.600",
            },
            bg: "gray.100",
            color: "gray.900",
          },
          _hover: {
            bg: "gray.100",
            color: "gray.900",
          },
        },
        tabpanel: {
          padding: 0,
        },
      }),
      variants: {
        onboarding: {
          tab: {
            borderRadius: "full",
            _hover: {
              background: "gray.100",
            },
            _selected: {
              background: "gray.100",
              _hover: {
                background: "gray.100",
              },
            },
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
            backgroundColor: mode(light.grey[400], dark.grey[600])(props),
          },
        },
        thumb: {
          backgroundColor: mode(light.grey.white, dark.grey.white)(props),
        },
      }),
    },
    Alert: {
      baseStyle: (props: StyleFunctionProps) => {
        let accentColor;

        switch (props.status) {
          case "success":
            accentColor = light.green;
            break;
          case "warning":
          case "error":
            accentColor = light.redDark;
            break;
          default:
            accentColor = light.grey[400];
        }

        return {
          container: {
            borderRadius: "6px",
            boxShadow: "0px 0px 8px 0px rgba(45, 55, 72, 0.25)",
            borderLeft: `4px solid ${accentColor}`,
            color: accentColor,
            background: light.grey["white"],
          },
          description: {
            color: light.grey[900],
          },
        };
      },
    },
    Link: {
      baseStyle: {
        textUnderlineOffset: "2px",
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
          cursor: "auto",
        },
        _hover: {
          _disabled: {
            bg: "gray.100",
          },
          textDecoration: "none",
        },
      },
      variants: {
        iconButton: {
          height: "34px",
          width: "34px",
          bg: "transparent",
          color: "gray.500",
          _hover: {
            background: "gray.100",
            color: "gray.600",
          },
        },
        outline: {
          borderColor: "gray.100",
          _hover: {
            background: "gray.100",
          },
          _active: {
            background: "gray.100",
          },
        },
        solid: {
          border: "1px solid",
          background: "gray.100",
          _hover: {
            background: "gray.100",
          },
        },
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
          bg: light.blueDark,
          color: dark.grey.black,
          _hover: {
            bg: light.blue,
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
          bg: "gray.100",
          color: "gray.900",
          _hover: { bg: "gray.200" },
          _dark: {
            bg: "gray.100",
            color: "gray.900",
            _hover: { bg: "gray.300" },
          },
          _disabled: {
            _hover: {
              _dark: {
                bg: "gray.100",
              },
            },
            _dark: {
              color: "gray.300",
            },
          },
        },
        socialLogin: {
          backgroundColor: "white",
          _dark: {
            backgroundColor: "black",
          },
          _hover: {
            backgroundColor: "gray.300",
            _dark: {
              backgroundColor: "gray.700",
            },
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
            md: "506px",
          },
        },
        header: {
          padding: { base: "12px", md: "20px" },
        },
        body: {
          paddingTop: 0,
          paddingBottom: "20px",
          paddingX: { base: "12px", md: "30px" },
        },
      },
    },
    Modal: {
      sizes: {
        xl: {
          dialog: {
            minWidth: { base: "100%", md: "536px" },
            maxWidth: "100%",
            marginX: 0,
          },
        },
      },
      baseStyle: {
        overlay: {
          background: "rgba(22, 22, 43, 0.80)",
          backdropFilter: "blur(5px)",
        },
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
          borderBottomRightRadius: { md: "30px", base: 0 },
          borderBottomLeftRadius: { md: "30px", base: 0 },
          background: "white",
          border: "1.5px solid",
          borderColor: "gray.100",
          padding: {
            base: "36px",
            md: "42px",
          },
          marginBottom: {
            md: "auto",
          },
          minWidth: {
            base: "100%",
            md: "508px",
          },
          width: {
            md: "508px",
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
      variants: {
        onboarding: {
          dialog: {
            marginBottom: { base: 0, md: "100px" },
          },
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
      "#root": {
        bg: mode(light.bgGradient, dark.bgGradient)(props),
      },
      "#root:has(.welcome-view)": {
        bg: "radial-gradient(123.02% 70.68% at 50% 49.96%, rgba(22, 22, 43, 0.00) 0%, #10121B 100%)",
      },
      body: {
        color: mode(light.grey[600], dark.grey[600])(props),
        bg: mode(light.bg, dark.bg)(props),
        _before: {
          maskImage: "url(/static/bg.svg)",
          bgColor: mode(light.bgMaskColor, dark.bgMaskColor)(props),
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
        "--chakra-colors-red-500": mode(light.red, dark.red)(props),
        "--chakra-colors-red-dark": mode(light.redDark, dark.redDark)(props),
        "--chakra-colors-blue-500": mode(light.blue, dark.blue)(props),
        "--chakra-colors-blue-dark": mode(light.blueDark, dark.blueDark)(props),
        "--chakra-colors-green-500": mode(light.green, dark.green)(props),
        "--chakra-colors-green-dark": mode(light.greenDark, dark.greenDark)(props),
        "--chakra-fontWeights-bold": 600,
      },
    }),
  },
});

export default theme;
