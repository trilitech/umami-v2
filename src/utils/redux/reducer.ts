import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage

import { createAsyncMigrate } from "./createAsyncMigrate";
import { VERSION, accountsMigrations, mainStoreMigrations } from "./migrations";
import { accountsSlice } from "./slices/accountsSlice/accountsSlice";
import { announcementSlice } from "./slices/announcementSlice";
import { assetsSlice } from "./slices/assetsSlice";
import { batchesSlice } from "./slices/batches";
import { beaconSlice } from "./slices/beaconSlice";
import { contactsSlice } from "./slices/contactsSlice";
import { errorsSlice } from "./slices/errorsSlice";
import { multisigsSlice } from "./slices/multisigsSlice";
import { networksSlice } from "./slices/networks";
import { tokensSlice } from "./slices/tokensSlice";

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
};

// if you add more slices then add their reset action to setupTests.ts
const rootReducers = combineReducers({
  accounts: persistReducer(accountsPersistConfig, accountsSlice.reducer),
  announcement: announcementSlice.reducer,
  assets: assetsSlice.reducer,
  batches: batchesSlice.reducer,
  beacon: beaconSlice.reducer,
  contacts: contactsSlice.reducer,
  errors: errorsSlice.reducer,
  multisigs: multisigsSlice.reducer,
  networks: networksSlice.reducer,
  tokens: tokensSlice.reducer,
});

export const reducer = persistReducer(rootPersistConfig, rootReducers);
