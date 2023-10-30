import { createSlice } from "@reduxjs/toolkit";
import { groupBy } from "lodash";
import { Multisig, MultisigOperation, MultisigPendingOperations } from "../../multisig/types";
import { RawPkh } from "../../../types/Address";

export type State = {
  items: Multisig[];
  pendingOperations: MultisigPendingOperations;
  labels: Record<RawPkh, string | undefined>;
};

const initialState: State = { items: [], pendingOperations: {}, labels: {} };

const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    setMultisigs: (state, { payload }: { payload: Multisig[] }) => {
      state.items = payload;
    },
    setPendingOperations: (state, { payload }: { payload: MultisigOperation[] }) => {
      state.pendingOperations = groupBy(payload, operation => operation.bigmapId);
    },
    setName: (state, { payload }: { payload: { label: string; pkh: RawPkh } }) => {
      const { pkh, label } = payload;
      state.labels[pkh] = label;
    },
    setDefaultNames: state => {
      state.items.forEach((multisig, i) => {
        const pkh = multisig.address.pkh;
        if (state.labels[pkh] === undefined) {
          state.labels[pkh] = `Multisig Account ${i}`;
        }
      });
    },
  },
});

export const multisigActions = multisigsSlice.actions;

export default multisigsSlice;
