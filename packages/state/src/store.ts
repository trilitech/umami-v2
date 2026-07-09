import { configureStore } from "@reduxjs/toolkit";
import { type Storage, persistReducer, persistStore } from "redux-persist";

import { makePersistConfigs, makePersistedReducer, makeReducer } from "./reducer";
import { accountsSlice } from "./slices/accounts/accounts";

const middleware = {
  serializableCheck: {
    // Needed to remove warning
    // https://github.com/rt2zz/redux-persist/issues/988#issuecomment-552242978
    ignoredActions: [
      "persist/FLUSH",
      "persist/REHYDRATE",
      "persist/PAUSE",
      "persist/PERSIST",
      "persist/PURGE",
      "persist/REGISTER",
    ],
  },
};

// Create initial store without persistence
export const makeStore = () => {
  const rootReducer = makeReducer();

  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware(middleware),
  });
};

// Store with persistence baked in at creation (the desktop v2.3.8 model):
// rehydrates existing plain-JSON localStorage at boot, no login step
export const makePersistedStore = (storage?: Storage) =>
  configureStore({
    reducer: makePersistedReducer(storage),
    middleware: getDefaultMiddleware => getDefaultMiddleware(middleware),
  });

// Initialize persistence after authentication
export const initializePersistence = (
  store: ReturnType<typeof makeStore>,
  password: string,
  storage?: Storage
) => {
  const configs = makePersistConfigs(storage, password);
  if (!configs) {
    throw new Error("Failed to create persistence configuration");
  }

  const { rootPersistConfig, accountsPersistConfig } = configs;
  const rootReducer = makeReducer();

  // Create persisted reducers
  const persistedRootReducer = persistReducer(rootPersistConfig, rootReducer);
  const persistedAccountsReducer = persistReducer(accountsPersistConfig, accountsSlice.reducer);

  // Combine persisted reducers
  const finalReducer = (state: any, action: any) => {
    const rootState = persistedRootReducer(state, action);

    if (state?.accounts) {
      const accountsState = persistedAccountsReducer(state.accounts, action);
      return { ...rootState, accounts: accountsState };
    }

    return rootState;
  };

  // Update store's reducer
  store.replaceReducer(finalReducer);

  const persistor = persistStore(store);

  return { persistor };
};

export type UmamiStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<UmamiStore["getState"]>;
export type AppDispatch = UmamiStore["dispatch"];
