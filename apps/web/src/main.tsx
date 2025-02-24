import { DynamicDisclosureProvider } from "@umami/components";
import { errorsActions } from "@umami/state";
import { getErrorContext } from "@umami/utils";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";

import { App } from "./components/App";
import { ErrorPage } from "./components/ErrorPage";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { ReduxStore } from "./providers/ReduxStore";
import { UmamiTheme } from "./providers/UmamiTheme";
import { store } from "./utils/store";
import "./utils/hotjar";

import "./utils/sentry";
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
        <ErrorBoundary fallback={<ErrorPage />} onError={logError}>
          <ReactQueryProvider>
            <BrowserRouter>
              <DynamicDisclosureProvider>
                <App />
              </DynamicDisclosureProvider>
            </BrowserRouter>
            {/* Uncomment to use react-query devtools */}
            {/* <ReactQueryDevtools initialIsOpen={true} /> */}
          </ReactQueryProvider>
        </ErrorBoundary>
      </ReduxStore>
    </UmamiTheme>
  </StrictMode>
);
