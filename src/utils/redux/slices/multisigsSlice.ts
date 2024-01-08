import { createSlice } from "@reduxjs/toolkit";
import { fromPairs, groupBy } from "lodash";

import { MultisigAccount } from "../../../types/Account";
import { Multisig, MultisigOperation, MultisigPendingOperations } from "../../multisig/types";

type State = {
  items: MultisigAccount[];
  pendingOperations: MultisigPendingOperations;
};

export const initialState: State = { items: [], pendingOperations: {} };

export const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    setMultisigs: (state, { payload }: { payload: Multisig[] }) => {
      const labelsByAddress = fromPairs(
        state.items.map(multisig => [multisig.address.pkh, multisig.label])
      );

      state.items = payload.map((multisig, i) => ({
        ...multisig,
        label: labelsByAddress[multisig.address.pkh] || `Multisig Account ${i}`,
        type: "multisig",
      }));
    },
    setPendingOperations: (state, { payload }: { payload: MultisigOperation[] }) => {
      state.pendingOperations = groupBy(payload, operation => operation.bigmapId);
    },
    // Do not call this directly, use the RenameAccount thunk
    setName: (state, { payload }: { payload: { newName: string; account: MultisigAccount } }) => {
      const {
        account: {
          address: { pkh },
        },
        newName,
      } = payload;

      const account = state.items.find(multisig => multisig.address.pkh === pkh);

      if (account) {
        account.label = newName;
      }
    },
  },
});

export const multisigActions = multisigsSlice.actions;
