import { ChakraProvider, ColorModeScript, useToast } from "@chakra-ui/react";
import { ToastProvider } from "@umami/utils";

import theme from "../style/theme";

export const UmamiTheme = (props: any) => {
  const toast = useToast();

  return (
    <ToastProvider toast={toast}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {props.children}
      </ChakraProvider>
    </ToastProvider>
  );
};
