import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import { buttonTheme } from "./theme/button";
import { checkboxTheme } from "./theme/checkbox";
import { drawerTheme } from "./theme/drawer";
import { listTheme } from "./theme/list";
import { modalTheme } from "./theme/modal";
import { radioTheme } from "./theme/radio";
import { switchTheme } from "./theme/switch";
import { tabsTheme } from "./theme/tabs";

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
      dark: colors.gray[400],
    },
  },
  styles: {
    global: {
      body: {
        bg: colors.black,
        color: colors.white,
        fontFamily: "Inter",
      },
    },
  },
});
export default theme;
