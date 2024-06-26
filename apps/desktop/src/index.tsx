/* istanbul ignore file */
import "./index.css";

import { getErrorContext } from "@umami/core";
import { errorsSlice, getPersistor, store } from "@umami/state";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { PersistGate } from "redux-persist/integration/react";

import { ErrorPage } from "./components/ErrorPage";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { ReduxStore } from "./providers/ReduxStore";
import { UmamiTheme } from "./providers/UmamiTheme";
import { Router } from "./Router";

const logError = (error: Error, info: { componentStack?: string | null }) => {
  const errorContext = { ...getErrorContext(error), stacktrace: String(info.componentStack) };
  store.dispatch(errorsSlice.actions.add(errorContext));
};

// is used in e2e tests to simplify state reading
Object.defineProperty(window, "reduxStore", { value: store });

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <UmamiTheme>
      <ReduxStore>
        <PersistGate loading={null} persistor={getPersistor()}>
          <ErrorBoundary fallback={<ErrorPage />} onError={logError}>
            <ReactQueryProvider>
              <Router />
              {/* Uncomment to use react-query devtools */}
              {/* <ReactQueryDevtools initialIsOpen={true} /> */}
            </ReactQueryProvider>
          </ErrorBoundary>
        </PersistGate>
      </ReduxStore>
    </UmamiTheme>
  </StrictMode>
);
