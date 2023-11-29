import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage

import { accountsSlice } from "./slices/accountsSlice";
import { assetsSlice } from "./slices/assetsSlice";
import { batchesSlice } from "./slices/batches";
import { contactsSlice } from "./slices/contactsSlice";
import { errorsSlice } from "./slices/errorsSlice";
import { multisigsSlice } from "./slices/multisigsSlice";
import { networksSlice } from "./slices/networks";
import { tokensSlice } from "./slices/tokensSlice";

const rootPersistConfig = {
  key: "root",
  storage,
  blacklist: ["accounts"],
};

const accountsPersistConfig = {
  key: "accounts",
  storage,
};

// if you add more slices then add their reset action to setupTests.ts
const rootReducers = combineReducers({
  accounts: persistReducer(accountsPersistConfig, accountsSlice.reducer),
  assets: assetsSlice.reducer,
  contacts: contactsSlice.reducer,
  multisigs: multisigsSlice.reducer,
  tokens: tokensSlice.reducer,
  errors: errorsSlice.reducer,
  networks: networksSlice.reducer,
  batches: batchesSlice.reducer,
});

export const reducer = persistReducer(rootPersistConfig, rootReducers);
