import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import { tokensSlice } from "./slices/tokensSlice";
import { accountsSlice } from "./slices/accountsSlice";
import { assetsSlice } from "./slices/assetsSlice";
import { contactsSlice } from "./slices/contactsSlice";
import { multisigsSlice } from "./slices/multisigsSlice";
import { errorsSlice } from "./slices/errorsSlice";
import { networksSlice } from "./slices/networks";
import { batchesSlice } from "./slices/batches";

export const rootPersistConfig = {
  key: "root",
  storage,
  blacklist: ["accounts"],
};

const accountsPersistConfig = {
  key: "accounts",
  storage,
};

// if you add more slices then add their reset action to setupTests.ts
export const rootReducers = combineReducers({
  accounts: persistReducer(accountsPersistConfig, accountsSlice.reducer),
  assets: assetsSlice.reducer,
  contacts: contactsSlice.reducer,
  multisigs: multisigsSlice.reducer,
  tokens: tokensSlice.reducer,
  errors: errorsSlice.reducer,
  networks: networksSlice.reducer,
  batches: batchesSlice.reducer,
});
