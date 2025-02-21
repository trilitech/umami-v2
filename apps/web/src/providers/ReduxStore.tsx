import { getOrCreateUserNonce, initializePersistence } from "@umami/state";
import { type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, setupPersistor } from "../utils/persistor";
import { store } from "../utils/store";

export const ReduxStore = ({ children }: PropsWithChildren) => (
  <Provider store={store}>
    <ReduxStoreContent>{children}</ReduxStoreContent>
  </Provider>
);

const ReduxStoreContent = ({ children }: PropsWithChildren) => {
  const nonce = getOrCreateUserNonce();
  if (!nonce) {
    return <>{children}</>;
  }
  if (!persistor) {
    const { persistor } = initializePersistence(store, nonce);
    setupPersistor(persistor);
    return (
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    );
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
};
