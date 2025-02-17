import { initializePersistence, makeStore } from "@umami/state";

// Start with in-memory store without persistence
export const store = makeStore();

// Function to enable persistence after authentication
export const setupPersistence = (password: string) => {
  try {
    const { persistor } = initializePersistence(store, password);
    return persistor;
  } catch (error) {
    console.error("Failed to initialize persistence:", error);
    return null;
  }
};
