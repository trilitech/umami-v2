/* istanbul ignore file */
import { produce } from "immer";
import { identity } from "lodash";

import { initialState as announcementsInitialState } from "./slices/announcementSlice";

export const VERSION = 3;

export const mainStoreMigrations = {
  0: (state: any) =>
    produce(state, (draft: any) => {
      draft.multisigs.labelsMap = {};
    }),
  1: (state: any) =>
    produce(state, (draft: any) => {
      draft.announcement = announcementsInitialState;
    }),
  2: identity,
  3: (state: any) =>
    produce(state, (draft: any) => {
      Object.entries(draft.beacon).forEach(([dAppId, connectionInfo]: [string, any]) => {
        draft.beacon[dAppId] = { [connectionInfo.accountPkh]: connectionInfo.networkType };
      });
    }),
} as any;

export const accountsMigrations = {
  0: identity,
  1: identity,
  2: (state: any) =>
    produce(state, (draft: any) => {
      draft.items.forEach((account: any) => {
        if (account.type === "secret_key") {
          account.curve = "ed25519";
        }
      });
    }),
  3: identity,
} as any;
