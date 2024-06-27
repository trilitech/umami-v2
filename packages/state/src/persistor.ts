import { type Persistor, persistStore } from "redux-persist";

import { store } from "./store";

let persistor: Persistor | undefined;

export const getPersistor = () => {
  if (!persistor) {
    persistor = persistStore(store);
  }
  return persistor;
};
