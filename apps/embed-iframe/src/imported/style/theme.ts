import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import { buttonTheme } from "./theme/button";
import { modalTheme } from "./theme/modal";

const config = {
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
    Button: buttonTheme,
    Modal: modalTheme,
  },
  config,
  colors: {
    umami: colors,
    text: colors.grey[900],
  },
  styles: {
    global: {
      body: {
        bg: "transparent",
        fontFamily: "Inter",
      },
    },
  },
});
export default theme;
