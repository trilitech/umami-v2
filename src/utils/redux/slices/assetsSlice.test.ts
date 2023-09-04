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
import { hedgehoge } from "../../../mocks/fa12Tokens";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { makeFormOperations } from "../../../components/sendForm/types";
import { Operation } from "../../../types/Operation";
import { ImplicitOperations } from "../../../components/sendForm/types";

const {
  actions: {
    updateTezBalance,
    updateTokenBalance,
    updateNetwork,
    updateTezTransfers,
    updateTokenTransfers,
    clearBatch,
    addToBatch,
    removeBatchItem,
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
      batches: [],
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
      batches: [],
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
      batches: [],
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
      batches: [],
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
      batches: [],
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
      batches: [],
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
      batches: [],
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
      batches: [],
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
      batches: [],
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
      batches: [],
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
      batches: [],
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  describe("batch", () => {
    describe("addToBatch", () => {
      it("can add operations to a non-existing batch", async () => {
        const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          mockTezOperation(0),
        ]);
        store.dispatch(addToBatch(formOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([formOperations]);
        });
      });

      it("can add new operations to the same account", async () => {
        const transfers: Operation[] = [];

        for (const operation of [
          mockTezOperation(1),
          mockDelegationOperation(1),
          mockNftOperation(1),
        ]) {
          const formOperations = makeFormOperations(
            mockImplicitAccount(1),
            mockImplicitAccount(1),
            [operation]
          );
          store.dispatch(addToBatch(formOperations));
          transfers.push(operation);

          await waitFor(() => {
            expect(store.getState().assets.batches).toEqual([
              makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), transfers),
            ]);
          });
        }
      });

      it("can add operations to different sender accounts", async () => {
        const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          mockTezOperation(0),
        ]) as ImplicitOperations;
        store.dispatch(addToBatch(formOperations));
        const anotherAccountFormOperations = { ...formOperations, sender: mockImplicitAccount(2) };
        store.dispatch(addToBatch(anotherAccountFormOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([
            formOperations,
            anotherAccountFormOperations,
          ]);
        });
      });
    });

    describe("clearBatch", () => {
      it("removes everything under a given account", async () => {
        const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          mockTezOperation(0),
          mockDelegationOperation(0),
          mockNftOperation(0),
        ]);
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(addToBatch(formOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([formOperations]);
        });
        store.dispatch(clearBatch({ pkh }));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([]);
        });
      });
    });

    describe("removeBatchItem", () => {
      it("removes the whole batch if there is just one operation", async () => {
        const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          mockTezOperation(0),
        ]);
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(addToBatch(formOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([formOperations]);
        });
        store.dispatch(removeBatchItem({ pkh, index: 0 }));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([]);
        });
      });

      it("removes the operation at the given index", async () => {
        const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          mockTezOperation(0),
          mockDelegationOperation(0),
          mockNftOperation(0),
        ]);
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(addToBatch(formOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([formOperations]);
        });
        store.dispatch(removeBatchItem({ pkh, index: 1 }));
        const newFormOperations = {
          ...formOperations,
          operations: [mockTezOperation(0), mockNftOperation(0)],
        };
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([newFormOperations]);
        });
      });

      it("does nothing if the index is out of bounds", async () => {
        const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          mockTezOperation(0),
        ]);
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(addToBatch(formOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([formOperations]);
        });
        store.dispatch(removeBatchItem({ pkh, index: 5 }));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([formOperations]);
        });
      });

      it("does nothing if the batch does not exist", async () => {
        const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          mockTezOperation(0),
        ]);
        store.dispatch(addToBatch(formOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([formOperations]);
        });

        store.dispatch(removeBatchItem({ pkh: mockImplicitAccount(2).address.pkh, index: 5 }));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([formOperations]);
        });
      });
    });
  });
});
