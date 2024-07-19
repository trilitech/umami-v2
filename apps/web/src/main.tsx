import { DynamicModalProvider } from "@umami/components";
import { getErrorContext } from "@umami/core";
import { errorsActions } from "@umami/state";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import { App } from "./App";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { ReduxStore } from "./providers/ReduxStore";
import { UmamiTheme } from "./providers/UmamiTheme";
import { persistor } from "./utils/persistor";
import { store } from "./utils/store";
import { ErrorPage } from "./views/ErrorPage/ErrorPage";

import "./index.scss";

// TODO: Move to a hook in @umami/state
const logError = (error: Error, info: { componentStack?: string | null }) => {
  const errorContext = { ...getErrorContext(error), stacktrace: String(info.componentStack) };
  store.dispatch(errorsActions.add(errorContext));
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UmamiTheme>
      <ReduxStore>
        <PersistGate loading={<div>loading</div>} persistor={persistor}>
          <ErrorBoundary fallback={<ErrorPage />} onError={logError}>
            <ReactQueryProvider>
              <BrowserRouter>
                <DynamicModalProvider>
                  <App />
                </DynamicModalProvider>
              </BrowserRouter>
              {/* Uncomment to use react-query devtools */}
              {/* <ReactQueryDevtools initialIsOpen={true} /> */}
            </ReactQueryProvider>
          </ErrorBoundary>
        </PersistGate>
      </ReduxStore>
    </UmamiTheme>
  </StrictMode>
);
