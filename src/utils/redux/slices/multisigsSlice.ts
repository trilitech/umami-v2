import { createSlice } from "@reduxjs/toolkit";
import { groupBy } from "lodash";
import { Multisig, MultisigOperation, MultisigPendingOperations } from "../../multisig/types";
import { RawPkh } from "../../../types/Address";
import { AccountType, MultisigAccount } from "../../../types/Account";

export type State = {
  items: MultisigAccount[];
  pendingOperations: MultisigPendingOperations;
};

const initialState: State = { items: [], pendingOperations: {} };

const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    setMultisigs: (state, { payload }: { payload: Multisig[] }) => {
      const multisigLabels = (state.items as MultisigAccount[]).reduce(
        (acc: Record<RawPkh, string | undefined>, multisig) => {
          acc[multisig.address.pkh] = multisig.label;
          return acc;
        },
        {}
      );

      state.items = payload.map((multisig, i) => ({
        ...multisig,
        label: multisigLabels[multisig.address.pkh] || `Multisig Account ${i}`,
        type: AccountType.MULTISIG,
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

      const position = state.items.findIndex(multisig => multisig.address.pkh === pkh);
      if (position >= 0) {
        state.items[position] = { ...state.items[position], label: newName };
      }
    },
  },
});

export const multisigActions = multisigsSlice.actions;

export default multisigsSlice;
