import { extendTheme } from "@chakra-ui/react";
import colors from "./colors";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    umami: colors,
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
