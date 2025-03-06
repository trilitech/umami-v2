import { ChakraProvider, ColorModeScript, useToast } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import { ToastProvider } from "@umami/utils";
import { type PropsWithChildren } from "react";
import "focus-visible/dist/focus-visible";

import { CustomToast } from "../components/CustomToast";
import theme from "../styles/theme";

const GlobalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

export const UmamiTheme = ({ children }: PropsWithChildren) => {
  const toast = useToast({ render: CustomToast });

  return (
    <ChakraProvider theme={theme}>
      <ToastProvider toast={toast}>
        <Global styles={GlobalStyles} />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {children}
      </ToastProvider>
    </ChakraProvider>
  );
};
