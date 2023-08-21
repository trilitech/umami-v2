import assetsSlice from "./assetsSlice";
import store from "../store";

import { waitFor } from "@testing-library/react";
import {
  mockDelegationOperation,
  mockNftOperation,
  mockImplicitAddress,
  mockTezTransaction,
  mockTezOperation,
  mockTokenTransaction,
  mockImplicitAccount,
} from "../../../mocks/factories";
import accountsSlice from "./accountsSlice";
import { estimateAndUpdateBatch } from "../thunks/estimateAndUpdateBatch";
import { hedgehoge } from "../../../mocks/fa12Tokens";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { makeFormOperations } from "../../../components/sendForm/types";
import { estimate } from "../../tezos";
import { mockEstimatedFee } from "../../../mocks/helpers";
import { Operation } from "../../../types/Operation";

const {
  actions: {
    updateTezBalance,
    updateTokenBalance,
    updateNetwork,
    updateTezTransfers,
    updateTokenTransfers,
    clearBatch,
  },
} = assetsSlice;

describe("assetsSlice", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().assets).toEqual({
      balances: {
        mutez: {},
        tokens: {},
      },
      transfers: { tez: {}, tokens: {} },
      delegations: {},
      network: "mainnet",
      conversionRate: null,
      bakers: [],
      batches: {},
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  test("tez balances are replaced", () => {
    store.dispatch(updateTezBalance([{ address: "foo", balance: 43 }]));

    expect(store.getState().assets).toEqual({
      balances: {
        mutez: {
          foo: "43",
        },
        tokens: {},
      },
      transfers: { tez: {}, tokens: {} },
      delegations: {},
      network: "mainnet",
      conversionRate: null,
      bakers: [],
      batches: {},
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });

    store.dispatch(
      updateTezBalance([
        { address: "bar", balance: 44 },
        { address: "baz", balance: 55 },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        mutez: {
          bar: "44",
          baz: "55",
        },
        tokens: {},
      },
      transfers: { tez: {}, tokens: {} },
      delegations: {},
      network: "mainnet",
      conversionRate: null,
      bakers: [],
      batches: {},
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  test("tez balances are updated", () => {
    store.dispatch(
      updateTezBalance([
        { address: "bar", balance: 44 },
        { address: "baz", balance: 55 },
      ])
    );

    store.dispatch(
      updateTezBalance([
        {
          address: "baz",
          balance: 66,
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        mutez: { baz: "66" },
        tokens: {},
      },
      conversionRate: null,
      delegations: {},
      bakers: [],
      network: "mainnet",
      transfers: { tez: {}, tokens: {} },
      batches: {},
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  test("token balances are updated", () => {
    store.dispatch(updateTokenBalance([hedgehoge(mockImplicitAddress(0))]));

    expect(store.getState().assets).toEqual({
      balances: {
        mutez: {},
        tokens: {
          [mockImplicitAddress(0).pkh]: [
            {
              balance: "10000000000",
              contract: "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9",
              tokenId: "0",
            },
          ],
        },
      },
      conversionRate: null,
      delegations: {},
      bakers: [],
      network: "mainnet",
      transfers: { tez: {}, tokens: {} },
      batches: {},
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  test("updating network resets operations and balances", () => {
    store.dispatch(
      updateTezBalance([
        { address: "bar", balance: 44 },
        { address: "baz", balance: 55 },
      ])
    );

    store.dispatch(updateTokenBalance([hedgehoge(mockImplicitAddress(0))]));

    store.dispatch(updateNetwork(TezosNetwork.GHOSTNET));

    expect(store.getState().assets).toEqual({
      balances: { mutez: {}, tokens: {} },
      transfers: { tez: {}, tokens: {} },
      delegations: {},
      bakers: [],
      network: "ghostnet",
      conversionRate: null,
      batches: {},
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  test("reseting accounts resets assetsState", () => {
    store.dispatch(
      updateTezBalance([
        { address: "bar", balance: 44 },
        { address: "baz", balance: 55 },
      ])
    );

    store.dispatch(updateTokenBalance([hedgehoge(mockImplicitAddress(0))]));

    store.dispatch(accountsSlice.actions.reset());

    expect(store.getState().assets).toEqual({
      balances: { mutez: {}, tokens: {} },
      transfers: { tez: {}, tokens: {} },
      delegations: {},
      bakers: [],
      network: "mainnet",
      conversionRate: null,
      batches: {},
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  test("tez transfers are upserted", () => {
    store.dispatch(
      updateTezTransfers([
        {
          pkh: "foo",
          transfers: [mockTezTransaction(1), mockTezTransaction(2)],
        },
        { pkh: "bar", transfers: [mockTezTransaction(3)] },
      ])
    );

    expect(store.getState().assets).toEqual({
      conversionRate: null,
      balances: {
        mutez: {},
        tokens: {},
      },
      delegations: {},
      bakers: [],
      network: "mainnet",
      batches: {},
      transfers: {
        tez: {
          foo: [mockTezTransaction(1), mockTezTransaction(2)],
          bar: [mockTezTransaction(3)],
        },
        tokens: {},
      },
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });

    store.dispatch(
      updateTezTransfers([
        {
          pkh: "foo",
          transfers: [mockTezTransaction(4)],
        },
        {
          pkh: "baz",
          transfers: [mockTezTransaction(5)],
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      conversionRate: null,
      balances: {
        mutez: {},
        tokens: {},
      },
      delegations: {},
      bakers: [],
      network: "mainnet",
      batches: {},
      transfers: {
        tez: {
          foo: [mockTezTransaction(4)],
          bar: [mockTezTransaction(3)],
          baz: [mockTezTransaction(5)],
        },
        tokens: {},
      },
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
    store.dispatch(updateNetwork(TezosNetwork.GHOSTNET));
  });

  test("token transfers are upserted", () => {
    store.dispatch(
      updateTokenTransfers([
        {
          pkh: "foo",
          transfers: [mockTokenTransaction(1), mockTokenTransaction(2)],
        },
        { pkh: "bar", transfers: [mockTokenTransaction(3)] },
      ])
    );

    expect(store.getState().assets).toEqual({
      conversionRate: null,
      balances: {
        mutez: {},
        tokens: {},
      },
      delegations: {},
      bakers: [],
      network: "mainnet",
      batches: {},
      transfers: {
        tokens: {
          foo: [mockTokenTransaction(1), mockTokenTransaction(2)],
          bar: [mockTokenTransaction(3)],
        },
        tez: {},
      },
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });

    store.dispatch(
      updateTokenTransfers([
        {
          pkh: "foo",
          transfers: [mockTokenTransaction(4)],
        },
        {
          pkh: "baz",
          transfers: [mockTokenTransaction(5)],
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      conversionRate: null,
      balances: {
        mutez: {},
        tokens: {},
      },
      delegations: {},
      bakers: [],
      network: "mainnet",
      transfers: {
        tokens: {
          foo: [mockTokenTransaction(4)],
          bar: [mockTokenTransaction(3)],
          baz: [mockTokenTransaction(5)],
        },
        tez: {},
      },
      batches: {},
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  describe("Batch", () => {
    test("Adding operations to batch starts an estimation and updates the given account's batch with the result", async () => {
      const transfers = [mockTezOperation(1), mockDelegationOperation(1), mockNftOperation(1)];

      mockEstimatedFee(12345);

      const formOperations = makeFormOperations(
        mockImplicitAccount(1),
        mockImplicitAccount(1),
        transfers
      );
      const action = estimateAndUpdateBatch(formOperations, TezosNetwork.MAINNET);

      store.dispatch(action);
      expect(jest.mocked(estimate)).toHaveBeenCalledWith(formOperations, TezosNetwork.MAINNET);
      await waitFor(() => {
        expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual(formOperations);
      });
    });

    it("can add new operations to the same account", async () => {
      mockEstimatedFee(12345);
      const transfers: Operation[] = [];

      for (const operation of [
        mockTezOperation(1),
        mockDelegationOperation(1),
        mockNftOperation(1),
      ]) {
        const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          operation,
        ]);
        const action = estimateAndUpdateBatch(formOperations, TezosNetwork.MAINNET);
        store.dispatch(action);
        expect(jest.mocked(estimate)).toHaveBeenCalledWith(formOperations, TezosNetwork.MAINNET);
        transfers.push(operation);

        await waitFor(() => {
          expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual(
            makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), transfers)
          );
        });
      }
    });

    test("Batches can be cleared for a given account", async () => {
      const transfers = [mockTezOperation(1)];

      mockEstimatedFee(323);

      const formOperations = makeFormOperations(
        mockImplicitAccount(1),
        mockImplicitAccount(1),
        transfers
      );

      const action = estimateAndUpdateBatch(formOperations, TezosNetwork.MAINNET);

      store.dispatch(action);
      await waitFor(() => {
        expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual(formOperations);
      });

      store.dispatch(clearBatch({ pkh: mockImplicitAddress(1).pkh }));

      expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual(undefined);
    });

    test("Adding operations to a batch that dont't pass estimation throws an error and doesn't update the given account's batch", async () => {
      const estimationError = new Error("estimation error");
      jest.mocked(estimate).mockRejectedValueOnce(estimationError);

      const transfers = [mockTezOperation(1), mockDelegationOperation(1), mockNftOperation(1)];
      const action = estimateAndUpdateBatch(
        makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), transfers),
        TezosNetwork.MAINNET
      );

      const dispatchResult = store.dispatch(action);
      await expect(dispatchResult).rejects.toThrow(estimationError.message);
      expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual(undefined);
    });
  });
});
