import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";

import { Layout } from "./layout";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { ReduxStore } from "./providers/ReduxStore";
import { UmamiTheme } from "./providers/UmamiTheme";
import { getErrorContext } from "./utils/getErrorContext";
import { ErrorPage } from "./views/ErrorPage/ErrorPage";

import "./index.scss";

const logError = (error: Error, info: { componentStack?: string | null }) => {
  const errorContext = { ...getErrorContext(error), stacktrace: String(info.componentStack) };
  // TODO: use error dispatch from redux store package
  // store.dispatch(errorsSlice.actions.add(errorContext));
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UmamiTheme>
      <ReduxStore>
        {/* <PersistGate loading={<div>loading</div>} persistor={persistor}> */}
        <ErrorBoundary fallback={<ErrorPage />} onError={logError}>
          <ReactQueryProvider>
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
            {/* Uncomment to use react-query devtools */}
            {/* <ReactQueryDevtools initialIsOpen={true} /> */}
          </ReactQueryProvider>
        </ErrorBoundary>
        {/* </PersistGate> */}
      </ReduxStore>
    </UmamiTheme>
  </React.StrictMode>
);
