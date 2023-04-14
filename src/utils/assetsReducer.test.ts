import assetsSlice from "./store/assetsSlice";
import { store } from "./store/store";

import { TezosNetwork } from "@airgap/tezos";
import { waitFor } from "@testing-library/react";
import BigNumber from "bignumber.js";
import {
  mockDelegationTransfer,
  mockNftTransfer,
  mockPk,
  mockPkh,
  mockTezTransaction,
  mockTezTransfer,
  mockTokenTransaction,
} from "../mocks/factories";
import accountsSlice from "./store/accountsSlice";
import { estimateAndUpdateBatch } from "./store/thunks/estimateAndupdateBatch";
import { estimateBatch } from "./tezos";
import { TransactionValues } from "../components/sendForm/types";
jest.mock("./tezos");

const estimateBatchMock = estimateBatch as jest.Mock;

const {
  actions: {
    reset,
    updateAssets: update,
    updateNetwork,
    updateTezOperations,
    updateTokenOperations,
    clearBatch,
    updateBatch,
  },
} = assetsSlice;

afterEach(() => {
  store.dispatch(reset());
});

describe("Assets reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().assets).toEqual({
      balances: {
        tez: {},
        tokens: {},
      },
      operations: { tez: {}, tokens: {} },
      delegations: {},
      network: "mainnet",
      conversionRate: null,
      bakers: [],
      batches: {},
    });
  });

  test("tez balances are added", () => {
    store.dispatch(update([{ pkh: "foo", tez: new BigNumber(43) }]));

    expect(store.getState().assets).toEqual({
      balances: {
        tez: {
          foo: new BigNumber(43),
        },
        tokens: {},
      },
      operations: { tez: {}, tokens: {} },
      delegations: {},
      network: "mainnet",
      conversionRate: null,
      bakers: [],
      batches: {},
    });

    store.dispatch(
      update([
        { pkh: "bar", tez: new BigNumber(44) },
        { pkh: "baz", tez: new BigNumber(55) },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        tez: {
          foo: new BigNumber(43),
          bar: new BigNumber(44),
          baz: new BigNumber(55),
        },
        tokens: {},
      },
      operations: { tez: {}, tokens: {} },
      delegations: {},
      network: "mainnet",
      conversionRate: null,
      bakers: [],
      batches: {},
    });
  });

  test("tez balances are updated", () => {
    store.dispatch(
      update([
        { pkh: "bar", tez: new BigNumber(44) },
        { pkh: "baz", tez: new BigNumber(55) },
      ])
    );

    store.dispatch(
      update([
        {
          pkh: "baz",
          tez: new BigNumber(66),
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        tez: { bar: new BigNumber(44), baz: new BigNumber(66) },
        tokens: {},
      },
      conversionRate: null,
      delegations: {},
      bakers: [],
      network: "mainnet",
      operations: { tez: {}, tokens: {} },
      batches: {},
    });
  });

  test("token balances are updated", () => {
    store.dispatch(
      update([
        { pkh: "bar", tez: new BigNumber(44) },
        { pkh: "baz", tez: new BigNumber(55) },
      ])
    );

    store.dispatch(
      update([
        {
          pkh: "baz",
          tokens: [{}, {}] as any,
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        tez: { bar: new BigNumber("44"), baz: new BigNumber("55") },
        tokens: { baz: [{}, {}] },
      },
      conversionRate: null,
      delegations: {},
      bakers: [],
      network: "mainnet",
      operations: { tez: {}, tokens: {} },
      batches: {},
    });
  });

  test("updating network resets operations and balances", () => {
    store.dispatch(
      update([
        { pkh: "bar", tez: new BigNumber(44) },
        { pkh: "baz", tez: new BigNumber(55) },
      ])
    );

    store.dispatch(
      update([
        {
          pkh: "foo",
          tokens: [{}, {}] as any,
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        tez: { bar: new BigNumber("44"), baz: new BigNumber("55") },
        tokens: { foo: [{}, {}] },
      },
      conversionRate: null,
      delegations: {},
      bakers: [],
      network: "mainnet",
      operations: { tez: {}, tokens: {} },
      batches: {},
    });

    store.dispatch(updateNetwork(TezosNetwork.GHOSTNET));

    expect(store.getState().assets).toEqual({
      balances: { tez: {}, tokens: {} },
      operations: { tez: {}, tokens: {} },
      delegations: {},
      bakers: [],
      network: "ghostnet",
      conversionRate: null,
      batches: {},
    });
  });

  test("reseting accounts resets assetsState", () => {
    store.dispatch(
      update([
        { pkh: "bar", tez: new BigNumber(44) },
        { pkh: "baz", tez: new BigNumber(55) },
      ])
    );

    store.dispatch(
      update([
        {
          pkh: "foo",
          tokens: [{}, {}] as any,
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        tez: { bar: new BigNumber("44"), baz: new BigNumber("55") },
        tokens: { foo: [{}, {}] },
      },
      conversionRate: null,
      delegations: {},
      bakers: [],
      network: "mainnet",
      operations: { tez: {}, tokens: {} },
      batches: {},
    });

    store.dispatch(accountsSlice.actions.reset());

    expect(store.getState().assets).toEqual({
      balances: { tez: {}, tokens: {} },
      operations: { tez: {}, tokens: {} },
      delegations: {},
      bakers: [],
      network: "mainnet",
      conversionRate: null,
      batches: {},
    });
  });

  test("tez transfers are upserted", () => {
    store.dispatch(
      updateTezOperations([
        {
          pkh: "foo",
          operations: [mockTezTransaction(1), mockTezTransaction(2)],
        },
        { pkh: "bar", operations: [mockTezTransaction(3)] },
      ])
    );

    expect(store.getState().assets).toEqual({
      conversionRate: null,
      balances: {
        tez: {},
        tokens: {},
      },
      delegations: {},
      bakers: [],
      network: "mainnet",
      batches: {},
      operations: {
        tez: {
          foo: [mockTezTransaction(1), mockTezTransaction(2)],
          bar: [mockTezTransaction(3)],
        },
        tokens: {},
      },
    });

    store.dispatch(
      updateTezOperations([
        {
          pkh: "foo",
          operations: [mockTezTransaction(4)],
        },
        {
          pkh: "baz",
          operations: [mockTezTransaction(5)],
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      conversionRate: null,
      balances: {
        tez: {},
        tokens: {},
      },
      delegations: {},
      bakers: [],
      network: "mainnet",
      batches: {},
      operations: {
        tez: {
          foo: [mockTezTransaction(4)],
          bar: [mockTezTransaction(3)],
          baz: [mockTezTransaction(5)],
        },
        tokens: {},
      },
    });
    store.dispatch(updateNetwork(TezosNetwork.GHOSTNET));
  });

  test("token transfers are upserted", () => {
    store.dispatch(
      updateTokenOperations([
        {
          pkh: "foo",
          operations: [mockTokenTransaction(1), mockTokenTransaction(2)],
        },
        { pkh: "bar", operations: [mockTokenTransaction(3)] },
      ])
    );

    expect(store.getState().assets).toEqual({
      conversionRate: null,
      balances: {
        tez: {},
        tokens: {},
      },
      delegations: {},
      bakers: [],
      network: "mainnet",
      batches: {},
      operations: {
        tokens: {
          foo: [mockTokenTransaction(1), mockTokenTransaction(2)],
          bar: [mockTokenTransaction(3)],
        },
        tez: {},
      },
    });

    store.dispatch(
      updateTokenOperations([
        {
          pkh: "foo",
          operations: [mockTokenTransaction(4)],
        },
        {
          pkh: "baz",
          operations: [mockTokenTransaction(5)],
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      conversionRate: null,
      balances: {
        tez: {},
        tokens: {},
      },
      delegations: {},
      bakers: [],
      network: "mainnet",
      operations: {
        tokens: {
          foo: [mockTokenTransaction(4)],
          bar: [mockTokenTransaction(3)],
          baz: [mockTokenTransaction(5)],
        },
        tez: {},
      },
      batches: {},
    });
  });

  describe("Batch", () => {
    test("Adding transactions to batch starts an estimation and updates the given account's batch with the result", async () => {
      const mockEstimations = [
        { suggestedFeeMutez: 323 },
        { suggestedFeeMutez: 423 },
        { suggestedFeeMutez: 523 },
      ];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      const transfers = [
        mockTezTransfer(1),
        mockDelegationTransfer(1),
        mockNftTransfer(1),
      ];
      const action = estimateAndUpdateBatch(
        mockPkh(1),
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      store.dispatch(action);
      expect(estimateBatchMock).toHaveBeenCalledWith(
        transfers,
        mockPkh(1),
        mockPk(1),
        TezosNetwork.MAINNET
      );
      expect(store.getState().assets.batches[mockPkh(1)]?.isSimulating).toEqual(
        true
      );
      await waitFor(() => {
        expect(store.getState().assets.batches[mockPkh(1)]).toEqual({
          isSimulating: false,
          items: [
            {
              fee: mockEstimations[0].suggestedFeeMutez,
              transaction: transfers[0],
            },
            {
              fee: mockEstimations[1].suggestedFeeMutez,
              transaction: transfers[1],
            },
            {
              fee: mockEstimations[2].suggestedFeeMutez,
              transaction: transfers[2],
            },
          ],
        });
      });
    });

    test("Batches can be cleared for a given account", async () => {
      const mockEstimations = [{ suggestedFeeMutez: 323 }];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      const transfers = [mockTezTransfer(1)];
      const action = estimateAndUpdateBatch(
        mockPkh(1),
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      store.dispatch(action);
      await waitFor(() => {
        expect(store.getState().assets.batches[mockPkh(1)]).toEqual({
          isSimulating: false,
          items: [
            {
              fee: mockEstimations[0].suggestedFeeMutez,
              transaction: transfers[0],
            },
          ],
        });
      });

      store.dispatch(clearBatch({ pkh: mockPkh(1) }));

      expect(store.getState().assets.batches[mockPkh(1)]).toEqual(undefined);
    });

    test("Adding transactions to a batch that dont't pass estimation throws an error and doesn't update the given account's batch", async () => {
      const estimationError = new Error("estimation error");
      estimateBatchMock.mockRejectedValueOnce(estimationError);

      const transfers = [
        mockTezTransfer(1),
        mockDelegationTransfer(1),
        mockNftTransfer(1),
      ];
      const action = estimateAndUpdateBatch(
        mockPkh(1),
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      const dispatchResult = store.dispatch(action);
      expect(store.getState().assets.batches[mockPkh(1)]?.isSimulating).toEqual(
        true
      );
      await expect(dispatchResult).rejects.toThrow(estimationError.message);
      expect(store.getState().assets.batches[mockPkh(1)]).toEqual({
        isSimulating: false,
        items: [],
      });
    });

    test("Running a concurrent estimation for a given account is not possible", async () => {
      const mockEstimations = [
        { suggestedFeeMutez: 323 },
        { suggestedFeeMutez: 423 },
        { suggestedFeeMutez: 523 },
      ];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);
      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      const transfers = [
        mockTezTransfer(1),
        mockDelegationTransfer(1),
        mockNftTransfer(1),
      ];

      const action = estimateAndUpdateBatch(
        mockPkh(1),
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      store.dispatch(action);
      const concurrentDispatch = store.dispatch(action);

      await expect(concurrentDispatch).rejects.toThrow(
        `Simulation already ongoing for ${mockPkh(1)}`
      );

      await waitFor(() => {
        expect(store.getState().assets.batches[mockPkh(1)]).toEqual({
          isSimulating: false,
          items: [
            {
              fee: mockEstimations[0].suggestedFeeMutez,
              transaction: transfers[0],
            },
            {
              fee: mockEstimations[1].suggestedFeeMutez,
              transaction: transfers[1],
            },
            {
              fee: mockEstimations[2].suggestedFeeMutez,
              transaction: transfers[2],
            },
          ],
        });
      });
    });

    test("You can't add an empty list of transactions to a batch", async () => {
      const mockEstimations = [
        { suggestedFeeMutez: 323 },
        { suggestedFeeMutez: 423 },
        { suggestedFeeMutez: 523 },
      ];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      const transfers: TransactionValues[] = [];

      const action = estimateAndUpdateBatch(
        mockPkh(1),
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      const dispatch = store.dispatch(action);

      await expect(dispatch).rejects.toThrow(
        `Can't add empty list of transactions to batch`
      );
    });

    test("Batch can't be cleared for a given account if simulation is ongoing for a given account", async () => {
      const mockEstimations = [
        { suggestedFeeMutez: 323 },
        { suggestedFeeMutez: 423 },
        { suggestedFeeMutez: 523 },
      ];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);
      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      store.dispatch(
        updateBatch({
          pkh: mockPkh(1),
          items: [{ fee: 3, transaction: mockTezTransfer(3) }],
        })
      );
      const transfers = [
        mockTezTransfer(1),
        mockDelegationTransfer(1),
        mockNftTransfer(1),
      ];

      const action = estimateAndUpdateBatch(
        mockPkh(1),
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      store.dispatch(action);
      store.dispatch(clearBatch({ pkh: mockPkh(1) }));

      await waitFor(() => {
        expect(store.getState().assets.batches[mockPkh(1)]).toEqual({
          isSimulating: false,
          items: [
            {
              fee: 3,
              transaction: mockTezTransfer(3),
            },
            {
              fee: mockEstimations[0].suggestedFeeMutez,
              transaction: transfers[0],
            },

            {
              fee: mockEstimations[1].suggestedFeeMutez,
              transaction: transfers[1],
            },
            {
              fee: mockEstimations[2].suggestedFeeMutez,
              transaction: transfers[2],
            },
          ],
        });
      });
    });
  });
});
