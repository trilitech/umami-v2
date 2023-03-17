import { WebStorage } from "redux-persist";

// Async storage in order not to couple the app to sync web localStorage

const storage: WebStorage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, item: string) => {
    // Here we could decide to save secureStorage state on file storage
    return Promise.resolve(localStorage.setItem(key, item));
  },
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
};

export default storage;
