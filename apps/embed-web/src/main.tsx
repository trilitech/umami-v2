import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";

import { EmbeddedComponent } from "./EmbeddedComponent";
import "./index.css";
import theme from "./imported/style/theme";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <EmbeddedComponent />
    </ChakraProvider>
  </React.StrictMode>
);
