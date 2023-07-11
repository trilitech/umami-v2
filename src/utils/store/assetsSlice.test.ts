import assetsSlice from "./assetsSlice";
import { store } from "./store";

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
} from "../../mocks/factories";
import accountsSlice from "./accountsSlice";
import { estimateAndUpdateBatch } from "./thunks/estimateAndupdateBatch";
import { estimateBatch } from "../tezos";
import { OperationValue } from "../../components/sendForm/types";
import { hedgehoge } from "../../mocks/fa12Tokens";
jest.mock("../tezos");

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
