import { getOrCreateUserNonce, initializePersistence, makeStore } from "@umami/state";

import { persistor, setupPersistor } from "./persistor";

// Start with in-memory store without persistence
export const store = makeStore();

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
  } catch (error) {
    console.error("Failed to initialize persistence:", error);
    return null;
  }
};
