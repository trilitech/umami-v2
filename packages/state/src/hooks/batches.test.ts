import { makeAccountOperations, mockImplicitAccount, mockTezOperation } from "@umami/core";
import { MAINNET } from "@umami/tezos";

import { useBatches, useClearBatch, useRemoveBatchItem } from "./batches";
import { batchesActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import { renderHook } from "../testUtils";

const account = mockImplicitAccount(0);

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("useBatches", () => {
  it("returns an empty array if there are no batches", () => {
    const {
      result: { current: result },
    } = renderHook(() => useBatches(), { store });
    expect(result).toEqual([]);
  });

  it("returns the batches for the selected network", () => {
    const operations = makeAccountOperations(account, account, [mockTezOperation(0)]);
    store.dispatch(
      batchesActions.add({
        operations,
        network: MAINNET,
      })
    );

    const {
      result: { current: result },
    } = renderHook(() => useBatches(), { store });

    expect(result).toEqual(store.getState().batches[MAINNET.name]);
  });
});

describe("useClearBatch", () => {
  it("removes all items from the batch", () => {
    for (let i = 0; i < 3; i++) {
      store.dispatch(
        batchesActions.add({
          operations: makeAccountOperations(account, account, [mockTezOperation(0)]),
          network: MAINNET,
        })
      );
    }

    const {
      result: { current: clearBatch },
    } = renderHook(() => useClearBatch(), { store });

    store.dispatch(clearBatch(account));

    expect(store.getState().batches[MAINNET.name]).toEqual([]);
  });
});

describe("useRemoveBatchItem", () => {
  it("removes an item from the batch by index", () => {
    const operation = mockTezOperation(0);
    for (let i = 0; i < 3; i++) {
      store.dispatch(
        batchesActions.add({
          operations: makeAccountOperations(account, account, [
            { ...operation, amount: String(i + 1) },
          ]),
          network: MAINNET,
        })
      );
    }

    const {
      result: { current: removeBatchItem },
    } = renderHook(() => useRemoveBatchItem(), { store });

    removeBatchItem(account, 1);

    expect(store.getState().batches[MAINNET.name]).toEqual([
      makeAccountOperations(account, account, [
        { ...operation, amount: "1" },
        { ...operation, amount: "3" },
      ]),
    ]);
  });
});
