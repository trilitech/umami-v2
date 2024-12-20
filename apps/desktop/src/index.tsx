/* istanbul ignore file */
import "./index.css";

import { errorsActions } from "@umami/state";
import { getErrorContext } from "@umami/utils";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ErrorPage } from "./components/ErrorPage";
import { Loader } from "./components/Loader/Loader";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { UmamiTheme } from "./providers/UmamiTheme";
import { Router } from "./Router";
import { persistor } from "./utils/persistor";
import { store } from "./utils/store";

const logError = (error: Error, info: { componentStack?: string | null }) => {
  const errorContext = { ...getErrorContext(error), stacktrace: String(info.componentStack) };
  store.dispatch(errorsActions.add(errorContext));
};

// is used in e2e tests to simplify state reading
Object.defineProperty(window, "reduxStore", { value: store });

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <UmamiTheme>
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <ErrorBoundary fallback={<ErrorPage />} onError={logError}>
            <ReactQueryProvider>
              <Router />
              {/* Uncomment to use react-query devtools */}
              {/* <ReactQueryDevtools initialIsOpen={true} /> */}
            </ReactQueryProvider>
          </ErrorBoundary>
        </PersistGate>
      </Provider>
    </UmamiTheme>
  </StrictMode>
);
