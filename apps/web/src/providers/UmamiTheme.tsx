import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

import theme from "../styles/theme";

export const UmamiTheme = ({ children }: PropsWithChildren) => (
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    {children}
  </ChakraProvider>
);
