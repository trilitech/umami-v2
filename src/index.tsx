import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Router from "./Router";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import theme from "./style/theme";
import { store } from "./utils/store/store";

import { QueryClient, QueryClientProvider } from "react-query";
import { UmamiTheme } from "./providers/UmamiTheme";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UmamiTheme>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <QueryClientProvider client={queryClient}>
            <Router />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </UmamiTheme>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
