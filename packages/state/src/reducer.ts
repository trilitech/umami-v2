import { combineReducers } from "@reduxjs/toolkit";
import { type Storage, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

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

export const makeReducer = (storage_: Storage | undefined) => {
  const storage = storage_ || getTestStorage() || createWebStorage("local");

  const rootPersistConfig = {
    key: "root",
    version: VERSION,
    storage,
    blacklist: ["accounts"],
    migrate: createAsyncMigrate(mainStoreMigrations, { debug: false }),
  };

  const accountsPersistConfig = {
    key: "accounts",
    version: VERSION,
    storage,
    migrate: createAsyncMigrate(accountsMigrations, { debug: false }),
    blacklist: ["password"],
  };

  const rootReducers = combineReducers({
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
  });

  return persistReducer(rootPersistConfig, rootReducers);
};
