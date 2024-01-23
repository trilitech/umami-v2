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
} as any;
