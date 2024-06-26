import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import { reducer } from "./reducer";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const makeStore = () =>
  configureStore({
    reducer: reducer,

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          // Needed to remove warning
          // https://github.com/rt2zz/redux-persist/issues/988#issuecomment-552242978
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export let store = makeStore();

export const resetStore = () => {
  store = makeStore();
};
