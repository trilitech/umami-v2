import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import { buttonTheme } from "./theme/button";
import { cardTheme } from "./theme/card";
import { checkboxTheme } from "./theme/checkbox";
import { drawerTheme } from "./theme/drawer";
import { listTheme } from "./theme/list";
import { modalTheme } from "./theme/modal";
import { radioTheme } from "./theme/radio";
import { switchTheme } from "./theme/switch";
import { tabsTheme } from "./theme/tabs";

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
    Card: cardTheme,
    Tabs: tabsTheme,
    Text: {
      baseStyle: {
        fontWeight: "400",
        fontFamily: "Inter",
      },
      sizes,
    },
    Heading: {
      baseStyle: {
        fontWeight: "600",
        fontFamily: "Inter",
      },
      sizes,
    },
    Checkbox: checkboxTheme,
    Input: {
      sizes: { md: { field: { height: "48px" } } },
      defaultProps: { variant: "filled" },
      variants: {
        filled: {
          field: {
            bg: colors.grey[800],
            border: "1px solid",
            borderColor: colors.grey[500],
            _invalid: {
              borderColor: colors.red,
            },
            _hover: {
              bg: colors.grey[800],
            },
            _focusVisible: {
              bg: colors.grey[800],
              borderColor: colors.grey[400],
            },
          },
        },
      },
    },
    Button: buttonTheme,
    FormLabel: {
      baseStyle: {
        fontWeight: "600",
        marginBottom: "12px",
        size: "md",
      },
      sizes,
    },
    Modal: modalTheme,
    Drawer: drawerTheme,
    Radio: radioTheme,
    List: listTheme,
    Switch: switchTheme,
  },
  config,
  colors: {
    umami: colors,
    text: {
      light: colors.grey[800],
      dark: colors.grey[400],
    },
  },
  // styles: {
  //   global: {
  //     body: {
  //       color: colors.grey.white,
  //     },
  //   },
  // },
});
export default theme;
