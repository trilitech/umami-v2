import {
  accountsActions,
  getOrCreateUserNonce,
  initializePersistence,
  makeStore,
} from "@umami/state";

import { persistor, setupPersistor } from "./persistor";
import { IS_DEV } from "../env";

// Start with in-memory store without persistence
export const store = makeStore();

// Put the store in the window for debugging purposes
if (IS_DEV) {
  window.store = store;
}

// Function to enable persistence after authentication
export const setupPersistence = (key: string) => {
  if (persistor) {
    return;
  }
  try {
    const nonce = getOrCreateUserNonce(key);
    if (!nonce) {
      throw new Error("Failed to create nonce");
    }
    const { persistor } = initializePersistence(store, nonce);
    setupPersistor(persistor);
    store.dispatch(accountsActions.setDefaultAccount());
  } catch (error) {
    console.error("Failed to initialize persistence:", error);
    return null;
  }
};
