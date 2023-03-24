import { extendTheme } from "@chakra-ui/react";
import colors from "./colors";

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
      sizes: sizes,
    },
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
        bg: "umami.black",
        color: "umami.white",
      },
    },
  },
});
export default theme;
