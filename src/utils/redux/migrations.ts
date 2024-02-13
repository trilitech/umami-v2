/* istanbul ignore file */
import { produce } from "immer";

import { initialState as announcementsInitialState } from "./slices/announcementSlice";

export const migrations = {
  0: (state: any) =>
    produce(state, (draft: any) => {
      draft.multisigs.labelsMap = {};
    }),
  1: (state: any) =>
    produce(state, (draft: any) => {
      draft.announcements = announcementsInitialState;
    }),
  2: (state: any) =>
    produce(state, (draft: any) => {
      draft.accounts.items = state.accounts.items.map((account: any) => {
        if (account.type === "secret_key") {
          account.curve = "ed25519";
        }
        return account;
      });
    }),
} as any;
