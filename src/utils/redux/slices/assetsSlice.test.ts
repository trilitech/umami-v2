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
import { makeAccountOperations } from "../../../components/sendForm/types";
import { Operation } from "../../../types/Operation";
import { ImplicitOperations } from "../../../components/sendForm/types";
import { GHOSTNET } from "../../../types/Network";
import { networksActions } from "./networks";

const {
  actions: {
    updateTezBalance,
    updateTokenBalance,
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
      transfers: { tez: {}, tokens: {} },
      batches: [],
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  test("updating network resets all assets", () => {
    store.dispatch(
      updateTezBalance([
        { address: "bar", balance: 44 },
        { address: "baz", balance: 55 },
      ])
    );

    store.dispatch(updateTokenBalance([hedgehoge(mockImplicitAddress(0))]));

    store.dispatch(networksActions.setCurrent(GHOSTNET));

    expect(store.getState().assets).toEqual({
      balances: { mutez: {}, tokens: {} },
      transfers: { tez: {}, tokens: {} },
      delegations: {},
      bakers: [],
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
    store.dispatch(networksActions.setCurrent(GHOSTNET));
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
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        store.dispatch(addToBatch(accountOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([accountOperations]);
        });
      });

      it("can add new operations to the same account", async () => {
        const transfers: Operation[] = [];

        for (const operation of [
          mockTezOperation(1),
          mockDelegationOperation(1),
          mockNftOperation(1),
        ]) {
          const accountOperations = makeAccountOperations(
            mockImplicitAccount(1),
            mockImplicitAccount(1),
            [operation]
          );
          store.dispatch(addToBatch(accountOperations));
          transfers.push(operation);

          await waitFor(() => {
            expect(store.getState().assets.batches).toEqual([
              makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), transfers),
            ]);
          });
        }
      });

      it("can add operations to different sender accounts", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        ) as ImplicitOperations;
        store.dispatch(addToBatch(accountOperations));
        const anotherAccountFormOperations = {
          ...accountOperations,
          sender: mockImplicitAccount(2),
        };
        store.dispatch(addToBatch(anotherAccountFormOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([
            accountOperations,
            anotherAccountFormOperations,
          ]);
        });
      });
    });

    describe("clearBatch", () => {
      it("removes everything under a given account", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockDelegationOperation(0), mockNftOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(addToBatch(accountOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([accountOperations]);
        });
        store.dispatch(clearBatch({ pkh }));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([]);
        });
      });
    });

    describe("removeBatchItem", () => {
      it("removes the whole batch if there is just one operation", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(addToBatch(accountOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([accountOperations]);
        });
        store.dispatch(removeBatchItem({ pkh, index: 0 }));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([]);
        });
      });

      it("removes the operation at the given index", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockDelegationOperation(0), mockNftOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(addToBatch(accountOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([accountOperations]);
        });
        store.dispatch(removeBatchItem({ pkh, index: 1 }));
        const newFormOperations = {
          ...accountOperations,
          operations: [mockTezOperation(0), mockNftOperation(0)],
        };
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([newFormOperations]);
        });
      });

      it("does nothing if the index is out of bounds", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(addToBatch(accountOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([accountOperations]);
        });
        store.dispatch(removeBatchItem({ pkh, index: 5 }));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([accountOperations]);
        });
      });

      it("does nothing if the batch does not exist", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        store.dispatch(addToBatch(accountOperations));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([accountOperations]);
        });

        store.dispatch(removeBatchItem({ pkh: mockImplicitAccount(2).address.pkh, index: 5 }));
        await waitFor(() => {
          expect(store.getState().assets.batches).toEqual([accountOperations]);
        });
      });
    });
  });
});
