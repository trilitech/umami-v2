import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { createAsyncMigrate } from "./createAsyncMigrate";
import { VERSION, accountsMigrations, mainStoreMigrations } from "./migrations";
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
  contacts: contactsSlice.reducer,
  errors: errorsSlice.reducer,
  multisigs: multisigsSlice.reducer,
  networks: networksSlice.reducer,
  protocolSettings: protocolSettingsSlice.reducer,
  tokens: tokensSlice.reducer,
});

export const reducer = persistReducer(rootPersistConfig, rootReducers);
