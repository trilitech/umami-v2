import { type Action, combineReducers } from "@reduxjs/toolkit";
import { type Storage, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { encryptTransform } from "redux-persist-transform-encrypt";

import { createAsyncMigrate } from "./createAsyncMigrate";
import { VERSION, accountsMigrations, mainStoreMigrations } from "./migrations";
import { wcSlice } from "./slices";
import { accountsSlice } from "./slices/accounts/accounts";
import { announcementSlice } from "./slices/announcement";
import { assetsSlice } from "./slices/assets";
import { batchesSlice } from "./slices/batches";
import { beaconSlice } from "./slices/beacon";
import { contactsSlice } from "./slices/contacts";
import { errorsSlice } from "./slices/errors";
import { multisigsSlice } from "./slices/multisigs";
import { networksSlice } from "./slices/networks";
import { protocolSettingsSlice } from "./slices/protocolSettings";
import { sessionSlice } from "./slices/session";
import { tokensSlice } from "./slices/tokens";

let TEST_STORAGE: Storage | undefined;

const getTestStorage = () => {
  if (!(process.env.NODE_ENV === "test" || process.env.CUCUMBER_WORKER_ID)) {
    return;
  }
  if (!TEST_STORAGE) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    TEST_STORAGE = require("redux-persist/lib/storage");
  }
  return TEST_STORAGE && "default" in TEST_STORAGE
    ? (TEST_STORAGE.default as Storage)
    : TEST_STORAGE;
};

export const makeReducer = () => {
  const appReducer = combineReducers({
    accounts: accountsSlice.reducer,
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
    session: sessionSlice.reducer,
  });

  return (state: any, action: Action) => {
    if (action.type === "RESET_ALL") {
      state = undefined;
    }
    return appReducer(state, action);
  };
};

// Persistence baked in at store creation, as shipped in desktop v2.3.8: plain
// redux-persist output (no encryptTransform), so existing desktop localStorage
// keeps rehydrating unchanged and no login step is needed.
export const makePersistedReducer = (storage_?: Storage) => {
  const storage = storage_ || getTestStorage() || createWebStorage("local");

  const rootPersistConfig = {
    key: "root",
    version: VERSION,
    storage,
    blacklist: ["accounts", "session"],
    migrate: createAsyncMigrate(mainStoreMigrations, { debug: false }),
  };

  const accountsPersistConfig = {
    key: "accounts",
    version: VERSION,
    storage,
    migrate: createAsyncMigrate(accountsMigrations, { debug: false }),
    blacklist: ["password"],
  };

  const appReducer = combineReducers({
    accounts: persistReducer(accountsPersistConfig, accountsSlice.reducer),
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
    session: sessionSlice.reducer,
  });

  const rootReducer = (state: any, action: Action) => {
    if (action.type === "RESET_ALL") {
      state = undefined;
    }
    return appReducer(state, action);
  };

  return persistReducer(rootPersistConfig, rootReducer);
};

export const makePersistConfigs = (storage_: Storage | undefined, password?: string) => {
  const storage = storage_ || getTestStorage() || createWebStorage("local");

  if (!password) {
    return null;
  }

  const rootPersistConfig = {
    key: "root",
    version: VERSION,
    storage,
    blacklist: ["accounts", "assets", "announcement", "tokens", "protocolSettings", "session"],
    migrate: createAsyncMigrate(mainStoreMigrations, { debug: false }),
    transforms: [
      encryptTransform(
        {
          secretKey: password,
          onError: error => {
            console.error("Error encrypting root state:", error);
          },
        },
        { whitelist: ["contacts", "batches", "multisigs", "networks"] }
      ),
    ],
  };

  const accountsPersistConfig = {
    key: "accounts",
    version: VERSION,
    storage,
    migrate: createAsyncMigrate(accountsMigrations, { debug: false }),
    blacklist: ["password"],
    transforms: [
      encryptTransform(
        {
          secretKey: password,
          onError: error => {
            console.error("Error encrypting accounts state:", error);
          },
        },
        { blacklist: ["defaultAccount", "seedPhrases", "secretKeys"] }
      ),
    ],
  };

  return { rootPersistConfig, accountsPersistConfig };
};
