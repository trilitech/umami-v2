import { ColorModeScript } from "@chakra-ui/color-mode";
import { ChakraProvider } from "@chakra-ui/provider";
import React from "react";
import theme from "../style/theme";

export const UmamiTheme = (props: any) => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {props.children}
    </ChakraProvider>
  );
};
