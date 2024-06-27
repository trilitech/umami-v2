import { createSlice } from "@reduxjs/toolkit";
import { type AccountOperations } from "@umami/core";
import { DefaultNetworks, type Network, type NetworkName, type RawPkh } from "@umami/tezos";
import { findIndex, fromPairs } from "lodash";

type State = Record<NetworkName, AccountOperations[] | undefined>;

export const batchesInitialState: State = fromPairs(
  DefaultNetworks.map(network => [network.name, []])
);

export const batchesSlice = createSlice({
  name: "batches",
  initialState: batchesInitialState,
  reducers: {
    reset: () => batchesInitialState,
    // Don't use this action directly. Use thunk estimateAndUpdateBatch
    // @ts-ignore: TS2589 Type instantiation is excessively deep and possibly infinite
    add: (
      state,
      {
        payload: { operations, network },
      }: { payload: { operations: AccountOperations; network: Network } }
    ) => {
      if (!(network.name in state)) {
        state[network.name] = [];
      }
      const batches = state[network.name] as AccountOperations[];
      const existing = batches.find(
        batch => batch.sender.address.pkh === operations.sender.address.pkh
      );
      if (existing) {
        existing.operations.push(...operations.operations);
        return;
      }
      batches.push(operations);
    },
    clear: (
      state,
      { payload: { pkh, network } }: { type: string; payload: { pkh: RawPkh; network: Network } }
    ) => {
      const batches = state[network.name] || [];
      const index = findIndex(batches, batch => batch.sender.address.pkh === pkh);
      if (index === -1) {
        return;
      }
      batches.splice(index, 1);
    },
    removeItem: (
      state,
      {
        payload: { pkh, index, network },
      }: { payload: { pkh: RawPkh; index: number; network: Network } }
    ) => {
      const batches = state[network.name] || [];
      const batchIndex = findIndex(batches, batch => batch.sender.address.pkh === pkh);
      if (batchIndex === -1) {
        return;
      }
      const existingBatch = batches[batchIndex];
      if (index < existingBatch.operations.length) {
        existingBatch.operations.splice(index, 1);
      }
      if (existingBatch.operations.length === 0) {
        batches.splice(batchIndex, 1);
      }
    },
    removeByAccounts: (state, { payload: pkhs }: { payload: RawPkh[] }) =>
      fromPairs(
        Object.entries(state).map(([networkName, batches]) => {
          const newBatches = (batches || []).filter(
            batch => !pkhs.includes(batch.sender.address.pkh)
          );
          return [networkName, newBatches];
        })
      ) as State,
  },
});

export const batchesActions = batchesSlice.actions;
