import { type PersistorOptions, persistStore } from "redux-persist";

import { store } from "./store";

export const persistor = persistStore(store);

// @ts-ignore
store.persistor = persistor;
