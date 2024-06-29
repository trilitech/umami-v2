import { getErrorContext } from "@umami/core";
import { accountsActions } from "@umami/state";
import { encryptedMnemonic1 } from "@umami/test-utils";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import { IS_DEV } from "./env";
import { Layout } from "./Layout";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { ReduxStore } from "./providers/ReduxStore";
import { UmamiTheme } from "./providers/UmamiTheme";
import { persistor } from "./utils/persistor";
import { store } from "./utils/store";
import { ErrorPage } from "./views/ErrorPage/ErrorPage";

import "./index.scss";

const logError = (error: Error, info: { componentStack?: string | null }) => {
  const _errorContext = { ...getErrorContext(error), stacktrace: String(info.componentStack) };
  // TODO: use error dispatch from redux store package
  // store.dispatch(errorsActions.add(errorContext));
};

if (IS_DEV) {
  const state = store.getState();
  if (!state.accounts.items.length) {
    // Add a testing account if there are no accounts in the store
    store.dispatch(
      accountsActions.addMnemonicAccounts({
        seedFingerprint: "test group",
        accounts: [
          {
            type: "mnemonic",
            address: {
              pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
              type: "implicit",
            },
            curve: "ed25519",
            label: "Account 1",
            derivationPath: "44'/1729'/0'/0'",
            derivationPathTemplate: "44'/1729'/?'/0'",
            pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
            seedFingerPrint: "test group",
          },
        ],
        encryptedMnemonic: encryptedMnemonic1,
      })
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UmamiTheme>
      <ReduxStore>
        <PersistGate loading={<div>loading</div>} persistor={persistor}>
          <ErrorBoundary fallback={<ErrorPage />} onError={logError}>
            <ReactQueryProvider>
              <BrowserRouter>
                <Layout />
              </BrowserRouter>
              {/* Uncomment to use react-query devtools */}
              {/* <ReactQueryDevtools initialIsOpen={true} /> */}
            </ReactQueryProvider>
          </ErrorBoundary>
        </PersistGate>
      </ReduxStore>
    </UmamiTheme>
  </React.StrictMode>
);
