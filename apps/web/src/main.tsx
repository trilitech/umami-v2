import { getErrorContext } from "@umami/core";
import { accountsActions, errorsActions } from "@umami/state";
import { encryptedMnemonic1 } from "@umami/test-utils";
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

// TODO: remove when onboarding is in place
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UmamiTheme>
      <ReduxStore>
        <PersistGate loading={<div>loading</div>} persistor={persistor}>
          <ErrorBoundary fallback={<ErrorPage />} onError={logError}>
            <ReactQueryProvider>
              <BrowserRouter>
                <App />
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
