import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import tokensSlice from "./slices/tokensSlice";
import accountsSlice from "./slices/accountsSlice";
import assetsSlice from "./slices/assetsSlice";
import contactsSlice from "./slices/contactsSlice";
import multisigsSlice from "./slices/multisigsSlice";

// See this answer for configuration of redux toolkit with redux-persist
// https://stackoverflow.com/a/63818121/6797267
const persistConfig = {
  key: "root",
  storage,
};

// if you add more slices then add their reset action to setupTests.ts
const reducers = combineReducers({
  accounts: accountsSlice.reducer,
  assets: assetsSlice.reducer,
  contacts: contactsSlice.reducer,
  multisigs: multisigsSlice.reducer,
  tokens: tokensSlice.reducer,
});

export default persistReducer(persistConfig, reducers);
