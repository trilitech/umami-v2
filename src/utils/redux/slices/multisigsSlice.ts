import { createSlice } from "@reduxjs/toolkit";
import { fromPairs, groupBy, omit } from "lodash";

import { MultisigAccount } from "../../../types/Account";
import { RawPkh } from "../../../types/Address";
import { Multisig, MultisigOperation, MultisigPendingOperations } from "../../multisig/types";

type State = {
  items: MultisigAccount[];
  pendingOperations: MultisigPendingOperations;
  /**
   * it's used for defining the label of a newly created multisig account
   * since we fetch multisigs from TZKT we need to know the label in advance
   * if we try to manually push the new account to the `items` array
   * then it'll be overwritten by the fetched data
   */
  labelsMap: Record<RawPkh, string>;
};

export const initialState: State = { items: [], pendingOperations: {}, labelsMap: {} };

export const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    // to be used only for testing
    mockAddAccount: (state, { payload }: { payload: Multisig }) => {
      state.items.push({
        label: `Multisig Account ${state.items.length}`,
        type: "multisig",
        ...payload,
      });
    },
    setMultisigs: (state, { payload }: { payload: Multisig[] }) => {
      const labelsByAddress = fromPairs(
        state.items.map(multisig => [multisig.address.pkh, multisig.label])
      );

      state.items = payload.map((multisig, i) => ({
        ...multisig,
        label:
          labelsByAddress[multisig.address.pkh] ||
          state.labelsMap[multisig.address.pkh] ||
          `Multisig Account ${i}`,
        type: "multisig",
      }));
    },
    addMultisigLabel: (
      state,
      { payload: { pkh, label } }: { payload: { pkh: RawPkh; label: string } }
    ) => {
      state.labelsMap[pkh] = label;
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
    // Does not remove multisigs itself, they will be overwritten on the next data refetch.
    removeMultisigsData: (state, { payload: addresses }: { payload: RawPkh[] }) => {
      const operationIdsToRemove = state.items
        .filter(multisig => addresses.includes(multisig.address.pkh))
        .map(multisig => String(multisig.pendingOperationsBigmapId));

      state.pendingOperations = omit(state.pendingOperations, operationIdsToRemove);
      state.labelsMap = omit(state.labelsMap, addresses);
    },
  },
});

export const multisigActions = multisigsSlice.actions;
