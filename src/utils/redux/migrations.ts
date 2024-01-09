import { produce } from "immer";

export const migrations = {
  0: (state: any) =>
    produce(state, (draft: any) => {
      draft.multisigs.labelsMap = {};
    }),
} as any;
