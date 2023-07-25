import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import { extraArgument } from "./extraArgument";
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

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Needed to remove warning
        // https://github.com/rt2zz/redux-persist/issues/988#issuecomment-552242978
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      thunk: {
        extraArgument,
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type ExtraArgument = typeof extraArgument;
