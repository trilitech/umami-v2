/* istanbul ignore file */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import { PersistGate } from "redux-persist/integration/react";

import { ErrorPage } from "./components/ErrorPage";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { ReduxStore } from "./providers/ReduxStore";
import { UmamiTheme } from "./providers/UmamiTheme";
import { Router } from "./Router";
import { getErrorContext } from "./utils/getErrorContext";
import { persistor } from "./utils/redux/persistor";
import { errorsSlice } from "./utils/redux/slices/errorsSlice";
import { store } from "./utils/redux/store";

const logError = (error: Error, info: { componentStack?: string | null }) => {
  const errorContext = { ...getErrorContext(error), stacktrace: String(info.componentStack) };
  store.dispatch(errorsSlice.actions.add(errorContext));
};

// is used in e2e tests to simplify state reading
Object.defineProperty(window, "reduxStore", { value: store });

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <UmamiTheme>
      <ReduxStore>
        <PersistGate loading={null} persistor={persistor}>
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
  </React.StrictMode>
);
