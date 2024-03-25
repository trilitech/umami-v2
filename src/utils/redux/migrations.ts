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
      if (draft.networks.current.name === "ghostnet") {
        draft.networks.current.buyTezUrl = "https://faucet.ghostnet.teztnets.com/";
      }
      for (const network of draft.networks.available) {
        if (network.name === "ghostnet") {
          network.buyTezUrl = "https://faucet.ghostnet.teztnets.com/";
          break;
        }
      }
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
