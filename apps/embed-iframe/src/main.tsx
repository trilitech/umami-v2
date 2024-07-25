import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { EmbeddedComponent } from "./EmbeddedComponent";
import theme from "./imported/style/theme";
import { EmbedAppProvider } from "./EmbedAppContext";
import "./main.scss";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <EmbedAppProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <EmbeddedComponent />
      </EmbedAppProvider>
    </ChakraProvider>
  </StrictMode>
);
