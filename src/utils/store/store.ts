import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "./storage";
import accountsSlice from "./accountsSlice";
import assetsSlice from "./assetsSlice";
import contactsSlice from "./contactsSlice";
import multisigsSlice from "./multisigsSlice";

// See this answer for configuration of redux toolkit with redux-persist
// https://stackoverflow.com/a/63818121/6797267
const persistConfig = {
  key: "root",
  storage,
};

const reducers = combineReducers({
  accounts: accountsSlice.reducer,
  assets: assetsSlice.reducer,
  contacts: contactsSlice.reducer,
  multisigs: multisigsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,

  // Needed to remove warning
  // https://stackoverflow.com/a/71955602/6797267
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
