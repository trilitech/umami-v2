import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import { reducer } from "./reducer";

export type UmamiStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<UmamiStore["getState"]>;
export type AppDispatch = UmamiStore["dispatch"];

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
