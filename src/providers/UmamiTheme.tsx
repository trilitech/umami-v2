import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import theme from "../style/theme";

export const UmamiTheme = (props: any) => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {props.children}
    </ChakraProvider>
  );
};
