import { configureStore } from "@reduxjs/toolkit";
import { type Storage, persistReducer, persistStore } from "redux-persist";

import { makePersistConfigs, makeReducer } from "./reducer";
import { accountsSlice } from "./slices/accounts/accounts";
import { setHasSession } from "./slices/session";

// Create initial store without persistence
export const makeStore = () => {
  const rootReducer = makeReducer();

  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
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
      }),
  });
};

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
    const accountsState = persistedAccountsReducer(state.accounts, action);
    return { ...rootState, accounts: accountsState };
  };

  // Update store's reducer
  store.replaceReducer(finalReducer);
  store.dispatch(setHasSession(true));

  const persistor = persistStore(store);
  return { persistor };
};

export type UmamiStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<UmamiStore["getState"]>;
export type AppDispatch = UmamiStore["dispatch"];
