import assetsSlice from "./assetsSlice";
import store from "../store";

import {
  mockImplicitAddress,
  mockTezTransaction,
  mockTokenTransaction,
} from "../../../mocks/factories";
import accountsSlice from "./accountsSlice";
import { hedgehoge } from "../../../mocks/fa12Tokens";
import { GHOSTNET } from "../../../types/Network";
import { networksActions } from "./networks";

const {
  actions: { updateTezBalance, updateTokenBalance, updateTezTransfers, updateTokenTransfers },
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
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
      latestOperations: [],
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
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
      latestOperations: [],
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
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
      latestOperations: [],
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
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
      latestOperations: [],
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
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
      latestOperations: [],
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
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
      latestOperations: [],
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
      latestOperations: [],
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
      latestOperations: [],
    });
    store.dispatch(networksActions.setCurrent(GHOSTNET));
  });

  test("token transfers are upserted", () => {
    store.dispatch(updateTokenTransfers([mockTokenTransaction(1), mockTokenTransaction(2)]));

    expect(store.getState().assets.transfers.tokens).toEqual({
      101: mockTokenTransaction(1),
      102: mockTokenTransaction(2),
    });

    store.dispatch(updateTokenTransfers([mockTokenTransaction(4)]));

    expect(store.getState().assets.transfers.tokens).toEqual({
      101: mockTokenTransaction(1),
      102: mockTokenTransaction(2),
      104: mockTokenTransaction(4),
    });
  });
});
