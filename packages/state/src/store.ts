import { configureStore } from "@reduxjs/toolkit";
import { type Storage } from "redux-persist";

import { makeReducer } from "./reducer";

export type UmamiStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<UmamiStore["getState"]>;
export type AppDispatch = UmamiStore["dispatch"];

export const makeStore = (storage?: Storage) =>
  configureStore({
    reducer: makeReducer(storage),
    devTools: process.env.NODE_ENV !== "production",

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          // Needed to remove warning
          // https://github.com/rt2zz/redux-persist/issues/988#issuecomment-552242978
          ignoredActions: [
            "persist/FLUSH",
            "persist/REHYDRATE",
            "persist/PAUSE",
            "persist/PERSIST",
            "persist/PURGE",
            "persist/REGISTER",
          ],
        },
      }),
  });
