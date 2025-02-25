import { type Persistor } from "redux-persist";

export let persistor: Persistor | null = null;

export const setupPersistor = (persistorVal: Persistor | null) => {
  if (persistorVal) {
    persistor = persistorVal;
  }
};

export const clearPersistor = () => {
  persistor = null;
};
