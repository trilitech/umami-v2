import assetsSlice from "./store/assetsSlice";
import { store } from "./store/store";

import { TezosNetwork } from "@airgap/tezos";
import { waitFor } from "@testing-library/react";
import {
  mockDelegationTransfer,
  mockNftTransfer,
  mockPk,
  mockImplicitAddress,
  mockTezTransaction,
  mockTezTransfer,
  mockTokenTransaction,
} from "../mocks/factories";
import accountsSlice from "./store/accountsSlice";
import { estimateAndUpdateBatch } from "./store/thunks/estimateAndupdateBatch";
import { estimateBatch } from "./tezos";
import { OperationValue } from "../components/sendForm/types";
import { mockBalancePlayload } from "../mocks/tzktResponse";
jest.mock("./tezos");

const estimateBatchMock = estimateBatch as jest.Mock;

const {
  actions: {
    reset,
    updateTezBalance,
    updateTokenBalance,
    updateNetwork,
    updateTezTransfers,
    updateTokenTransfers,
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
      transfers: { tez: {}, tokens: {} },
      delegations: {},
      network: "mainnet",
      conversionRate: null,
      bakers: [],
      batches: {},
      blockLevel: null,
    });
  });

  test("tez balances are replaced", () => {
    store.dispatch(updateTezBalance([{ pkh: "foo", tez: "43" }]));

    expect(store.getState().assets).toEqual({
      balances: {
        tez: {
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
    });

    store.dispatch(
      updateTezBalance([
        { pkh: "bar", tez: "44" },
        { pkh: "baz", tez: "55" },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        tez: {
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
    });
  });

  test("tez balances are updated", () => {
    store.dispatch(
      updateTezBalance([
        { pkh: "bar", tez: "44" },
        { pkh: "baz", tez: "55" },
      ])
    );

    store.dispatch(
      updateTezBalance([
        {
          pkh: "baz",
          tez: "66",
        },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        tez: { baz: "66" },
        tokens: {},
      },
      conversionRate: null,
      delegations: {},
      bakers: [],
      network: "mainnet",
      transfers: { tez: {}, tokens: {} },
      batches: {},
      blockLevel: null,
    });
  });

  test("token balances are updated", () => {
    store.dispatch(updateTokenBalance([mockBalancePlayload]));

    expect(store.getState().assets).toEqual({
      balances: {
        tez: {},
        tokens: {
          baz: [
            {
              balance: "1",
              contract: "mockContract",
              metadata: {
                decimals: "2",
                symbol: "mockSymbol",
              },
              tokenId: "0",
              type: "fa2",
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
    });
  });

  test("updating network resets operations and balances", () => {
    store.dispatch(
      updateTezBalance([
        { pkh: "bar", tez: "44" },
        { pkh: "baz", tez: "55" },
      ])
    );

    store.dispatch(updateTokenBalance([mockBalancePlayload]));

    expect(store.getState().assets).toEqual({
      balances: {
        tez: { bar: "44", baz: "55" },
        tokens: {
          baz: [
            {
              balance: "1",
              contract: "mockContract",
              metadata: {
                decimals: "2",
                symbol: "mockSymbol",
              },
              tokenId: "0",
              type: "fa2",
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
    });

    store.dispatch(updateNetwork(TezosNetwork.GHOSTNET));

    expect(store.getState().assets).toEqual({
      balances: { tez: {}, tokens: {} },
      transfers: { tez: {}, tokens: {} },
      delegations: {},
      bakers: [],
      network: "ghostnet",
      conversionRate: null,
      batches: {},
      blockLevel: null,
    });
  });

  test("reseting accounts resets assetsState", () => {
    store.dispatch(
      updateTezBalance([
        { pkh: "bar", tez: "44" },
        { pkh: "baz", tez: "55" },
      ])
    );

    store.dispatch(updateTokenBalance([mockBalancePlayload]));

    expect(store.getState().assets).toEqual({
      balances: {
        tez: { bar: "44", baz: "55" },
        tokens: {
          baz: [
            {
              balance: "1",
              contract: "mockContract",
              metadata: {
                decimals: "2",
                symbol: "mockSymbol",
              },
              tokenId: "0",
              type: "fa2",
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
    });

    store.dispatch(accountsSlice.actions.reset());

    expect(store.getState().assets).toEqual({
      balances: { tez: {}, tokens: {} },
      transfers: { tez: {}, tokens: {} },
      delegations: {},
      bakers: [],
      network: "mainnet",
      conversionRate: null,
      batches: {},
      blockLevel: null,
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
        tez: {},
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
        tez: {},
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
        tez: {},
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
        tez: {},
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
    });
  });

  describe("Batch", () => {
    test("Adding operations to batch starts an estimation and updates the given account's batch with the result", async () => {
      const mockEstimations = [
        { suggestedFeeMutez: "323" },
        { suggestedFeeMutez: "423" },
        { suggestedFeeMutez: "523" },
      ];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      const transfers = [mockTezTransfer(1), mockDelegationTransfer(1), mockNftTransfer(1)];
      const action = estimateAndUpdateBatch(
        mockImplicitAddress(1).pkh,
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      store.dispatch(action);
      expect(estimateBatchMock).toHaveBeenCalledWith(
        transfers,
        mockImplicitAddress(1).pkh,
        mockPk(1),
        TezosNetwork.MAINNET
      );
      expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]?.isSimulating).toEqual(
        true
      );
      await waitFor(() => {
        expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual({
          isSimulating: false,
          items: [
            {
              fee: mockEstimations[0].suggestedFeeMutez,
              operation: transfers[0],
            },
            {
              fee: mockEstimations[1].suggestedFeeMutez,
              operation: transfers[1],
            },
            {
              fee: mockEstimations[2].suggestedFeeMutez,
              operation: transfers[2],
            },
          ],
        });
      });
    });

    test("Batches can be cleared for a given account", async () => {
      const mockEstimations = [{ suggestedFeeMutez: "323" }];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      const transfers = [mockTezTransfer(1)];
      const action = estimateAndUpdateBatch(
        mockImplicitAddress(1).pkh,
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      store.dispatch(action);
      await waitFor(() => {
        expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual({
          isSimulating: false,
          items: [
            {
              fee: mockEstimations[0].suggestedFeeMutez,
              operation: transfers[0],
            },
          ],
        });
      });

      store.dispatch(clearBatch({ pkh: mockImplicitAddress(1).pkh }));

      expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual(undefined);
    });

    test("Adding operations to a batch that dont't pass estimation throws an error and doesn't update the given account's batch", async () => {
      const estimationError = new Error("estimation error");
      estimateBatchMock.mockRejectedValueOnce(estimationError);

      const transfers = [mockTezTransfer(1), mockDelegationTransfer(1), mockNftTransfer(1)];
      const action = estimateAndUpdateBatch(
        mockImplicitAddress(1).pkh,
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      const dispatchResult = store.dispatch(action);
      expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]?.isSimulating).toEqual(
        true
      );
      await expect(dispatchResult).rejects.toThrow(estimationError.message);
      expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual({
        isSimulating: false,
        items: [],
      });
    });

    test("Running a concurrent estimation for a given account is not possible", async () => {
      const mockEstimations = [
        { suggestedFeeMutez: "323" },
        { suggestedFeeMutez: "423" },
        { suggestedFeeMutez: "523" },
      ];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);
      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      const transfers = [mockTezTransfer(1), mockDelegationTransfer(1), mockNftTransfer(1)];

      const action = estimateAndUpdateBatch(
        mockImplicitAddress(1).pkh,
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      store.dispatch(action);
      const concurrentDispatch = store.dispatch(action);

      await expect(concurrentDispatch).rejects.toThrow(
        `Simulation already ongoing for ${mockImplicitAddress(1).pkh}`
      );

      await waitFor(() => {
        expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual({
          isSimulating: false,
          items: [
            {
              fee: mockEstimations[0].suggestedFeeMutez,
              operation: transfers[0],
            },
            {
              fee: mockEstimations[1].suggestedFeeMutez,
              operation: transfers[1],
            },
            {
              fee: mockEstimations[2].suggestedFeeMutez,
              operation: transfers[2],
            },
          ],
        });
      });
    });

    test("You can't add an empty list of operations to a batch", async () => {
      const mockEstimations = [
        { suggestedFeeMutez: "323" },
        { suggestedFeeMutez: "423" },
        { suggestedFeeMutez: "523" },
      ];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      const operations: OperationValue[] = [];

      const action = estimateAndUpdateBatch(
        mockImplicitAddress(1).pkh,
        mockPk(1),
        operations,
        TezosNetwork.MAINNET
      );

      const dispatch = store.dispatch(action);

      await expect(dispatch).rejects.toThrow(`Can't add empty list of operations to batch`);
    });

    test("Batch can't be cleared for a given account if simulation is ongoing for a given account", async () => {
      const mockEstimations = [
        { suggestedFeeMutez: "323" },
        { suggestedFeeMutez: "423" },
        { suggestedFeeMutez: "523" },
      ];

      estimateBatchMock.mockResolvedValueOnce(mockEstimations);
      estimateBatchMock.mockResolvedValueOnce(mockEstimations);

      store.dispatch(
        updateBatch({
          pkh: mockImplicitAddress(1).pkh,
          items: [{ fee: "3", operation: mockTezTransfer(3) }],
        })
      );
      const transfers = [mockTezTransfer(1), mockDelegationTransfer(1), mockNftTransfer(1)];

      const action = estimateAndUpdateBatch(
        mockImplicitAddress(1).pkh,
        mockPk(1),
        transfers,
        TezosNetwork.MAINNET
      );

      store.dispatch(action);
      store.dispatch(clearBatch({ pkh: mockImplicitAddress(1).pkh }));

      await waitFor(() => {
        expect(store.getState().assets.batches[mockImplicitAddress(1).pkh]).toEqual({
          isSimulating: false,
          items: [
            {
              fee: "3",
              operation: mockTezTransfer(3),
            },
            {
              fee: mockEstimations[0].suggestedFeeMutez,
              operation: transfers[0],
            },

            {
              fee: mockEstimations[1].suggestedFeeMutez,
              operation: transfers[1],
            },
            {
              fee: mockEstimations[2].suggestedFeeMutez,
              operation: transfers[2],
            },
          ],
        });
      });
    });
  });
});
