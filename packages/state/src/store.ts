import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { type Storage, persistReducer } from "redux-persist";

import { makePersistConfigs, makeReducer } from "./reducer";
import {
  announcementSlice,
  batchesSlice,
  beaconSlice,
  contactsSlice,
  errorsSlice,
  multisigsSlice,
  networksSlice,
  protocolSettingsSlice,
  tokensSlice,
  wcSlice,
} from "./slices";
import { accountsSlice } from "./slices/accounts/accounts";
import { assetsSlice } from "./slices/assets";

// Create initial store without persistence
export const makeStore = () => {
  const rootReducer = makeReducer();

  const store = configureStore({
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

  return store;
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

  // Combine persisted reducers
  const finalReducer = combineReducers({
    announcement: announcementSlice.reducer,
    assets: assetsSlice.reducer,
    batches: batchesSlice.reducer,
    beacon: beaconSlice.reducer,
    walletconnect: wcSlice.reducer,
    contacts: contactsSlice.reducer,
    errors: errorsSlice.reducer,
    multisigs: multisigsSlice.reducer,
    networks: networksSlice.reducer,
    protocolSettings: protocolSettingsSlice.reducer,
    tokens: tokensSlice.reducer,
    accounts: persistReducer(accountsPersistConfig, accountsSlice.reducer),
  });

  // Update store's reducer
  store.replaceReducer(persistReducer(rootPersistConfig, finalReducer as any));
  // @ts-ignore
  store.persistor.persist();

  // const persistor = persistStore(store);
  // return { persistor };
};

export type UmamiStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<UmamiStore["getState"]>;
export type AppDispatch = UmamiStore["dispatch"];
