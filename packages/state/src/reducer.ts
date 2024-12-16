import { combineReducers } from "@reduxjs/toolkit";
import {
  type PersistConfig,
  type PersistedState,
  type Storage,
  getStoredState,
  persistReducer,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import { createAsyncMigrate } from "./createAsyncMigrate";
import { VERSION, accountsMigrations, mainStoreMigrations } from "./migrations";
import { wcSlice } from "./slices";
import { accountsSlice } from "./slices/accounts/accounts";
import { announcementSlice } from "./slices/announcement";
import { assetsSlice } from "./slices/assets";
import { batchesSlice } from "./slices/batches";
import { beaconSlice } from "./slices/beacon";
import { contactsSlice } from "./slices/contacts";
import { errorsSlice } from "./slices/errors";
import { multisigsSlice } from "./slices/multisigs";
import { networksSlice } from "./slices/networks";
import { protocolSettingsSlice } from "./slices/protocolSettings";
import { tokensSlice } from "./slices/tokens";

let TEST_STORAGE: Storage | undefined;

const getTestStorage = () => {
  if (!(process.env.NODE_ENV === "test" || process.env.CUCUMBER_WORKER_ID)) {
    return;
  }
  if (!TEST_STORAGE) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    TEST_STORAGE = require("redux-persist/lib/storage");
  }
  return TEST_STORAGE && "default" in TEST_STORAGE
    ? (TEST_STORAGE.default as Storage)
    : TEST_STORAGE;
};

export const processMigrationData = (backupData: any) => {
  try {
    const processedData: { accounts: any; root: any } = {
      accounts: null,
      root: null,
    };

    console.log(backupData, "backupData");

    if (backupData["persist:accounts"]?.accountsValue) {
      const accountsValue = backupData["persist:accounts"].accountsValue.slice(1);
      processedData.accounts = JSON.parse(accountsValue);

      for (const item in processedData.accounts) {
        processedData.accounts[item] = JSON.parse(processedData.accounts[item]);
      }
    }

    if (backupData["persist:root"]?.rootValue) {
      const sanitizedRootValue = backupData["persist:root"].rootValue.replaceAll(
        // eslint-disable-next-line no-control-regex
        /[\u0000-\u001F\u007F-\u009F]/g,
        ""
      );

      processedData.root = JSON.parse(sanitizedRootValue);

      for (const item in processedData.root) {
        processedData.root[item] = JSON.parse(processedData.root[item]);
      }
    }

    return processedData;
  } catch (error) {
    console.error("Error processing backup data:", error);
    return null;
  }
};

export const makeReducer = (storage_: Storage | undefined) => {
  const storage = storage_ || getTestStorage() || createWebStorage("local");

  // Custom getStoredState function to handle migration
  const customGetStoredState = async (config: PersistConfig<any>): Promise<PersistedState> => {
    try {
      // First try to get state from current storage
      const state = (await getStoredState(config)) as PersistedState;
      console.log(state, "state");
      if (state) {
        return state;
      }

      // If no state, check if we have backup data
      // @ts-ignore
      if (window.electronAPI) {
        return new Promise(resolve => {
          // @ts-ignore
          window.electronAPI.onBackupData((_, data) => {
            if (data) {
              const processed = processMigrationData(data);
              console.log(processed, "processed");
              if (processed) {
                // Return the processed state based on config key
                // @ts-ignore
                return resolve(config.key === "root" ? processed.root : processed.accounts);
              }
            }
            resolve(undefined);
          });
        });
      }
    } catch (err) {
      console.error("Error getting stored state:", err);
      return undefined;
    }
  };

  const rootPersistConfig = {
    key: "root",
    version: VERSION,
    storage,
    blacklist: ["accounts"],
    getStoredState: customGetStoredState,
    migrate: createAsyncMigrate(mainStoreMigrations, { debug: false }),
  };

  const accountsPersistConfig = {
    key: "accounts",
    version: VERSION,
    storage,
    getStoredState: customGetStoredState,
    migrate: createAsyncMigrate(accountsMigrations, { debug: false }),
    blacklist: ["password"],
  };

  const rootReducers = combineReducers({
    accounts: persistReducer(accountsPersistConfig, accountsSlice.reducer),
    announcement: announcementSlice.reducer,
    assets: assetsSlice.reducer,
    batches: batchesSlice.reducer,
    beacon: beaconSlice.reducer,
    walletconnect: wcSlice.reducer,
    contacts: contactsSlice.reducer,
    errors: errorsSlice.reducer,
    multisigs: multisigsSlice.reducer,
    networks: networksSlice.reducer,
    protocolSettings: protocolSettingsSlice.reducer,
    tokens: tokensSlice.reducer,
  });

  return persistReducer(rootPersistConfig, rootReducers);
};
