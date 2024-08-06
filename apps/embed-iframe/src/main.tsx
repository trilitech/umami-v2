import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { EmbeddedComponent } from "./EmbeddedComponent";
import theme from "./imported/style/theme";
import { EmbedAppProvider } from "./EmbedAppContext";
import "./main.scss";
import { LoginModalProvider } from "./LoginModalContext";
import { OperationModalProvider } from "./OperationModalContext";

import { Analytics } from "@vercel/analytics/react";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <EmbedAppProvider>
        <LoginModalProvider>
          <OperationModalProvider>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <EmbeddedComponent />
            <Analytics />
          </OperationModalProvider>
        </LoginModalProvider>
      </EmbedAppProvider>
    </ChakraProvider>
  </StrictMode>
);
