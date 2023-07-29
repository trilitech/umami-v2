import { extendTheme } from "@chakra-ui/react";
import colors from "./colors";
import { modalTheme } from "./theme/modal";

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
      baseStyle: {
        fontWeight: "400",
      },
      sizes,
    },
    Heading: {
      baseStyle: {
        fontWeight: "600",
      },
      sizes,
    },
    Input: {
      sizes: { md: { field: { height: "48px" } } },
      variants: {
        filled: {
          field: {
            bg: colors.gray[800],
            border: "1px solid",
            borderColor: colors.gray[500],
            _invalid: {
              borderColor: colors.orange,
            },
            _hover: {
              bg: colors.gray[800],
            },
            _focusVisible: {
              bg: colors.gray[800],
              borderColor: colors.gray[450],
            },
          },
        },
      },
    },
    Button: {
      sizes: { md: { height: "48px" } },
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
            bc: colors.gray[600],
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
      },
    },
    FormLabel: {
      baseStyle: {
        fontWeight: "600",
        marginBottom: "4px",
        size: "md",
      },
      sizes,
    },
    Modal: modalTheme,
  },
  config,
  colors: {
    umami: colors,
    text: {
      dark: colors.gray[400],
    },
  },
  styles: {
    global: {
      body: {
        bg: colors.black,
        color: colors.white,
      },
    },
  },
});
export default theme;
