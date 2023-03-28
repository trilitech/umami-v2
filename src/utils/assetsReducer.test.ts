import assetsSlice from "./store/assetsSlice";
import { store } from "./store/store";

import BigNumber from "bignumber.js";
import { TezosNetwork } from "@airgap/tezos";
import accountsSlice from "./store/accountsSlice";
import { mockTezTransaction, mockTokenTransaction } from "../mocks/factories";

const {
  actions: {
    reset,
    updateAssets: update,
    updateNetwork,
    updateTezOperations,
    updateTokenOperations,
  },
} = assetsSlice;

afterEach(() => {
  store.dispatch(reset());
});

describe("Assets reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().assets).toEqual({
      balances: {},
      operations: { tez: {}, tokens: {} },
      network: "mainnet",
      conversionRate: null,
    });
  });

  test("tez balances are added", () => {
    store.dispatch(update([{ pkh: "foo", tez: new BigNumber(33) }]));

    expect(store.getState().assets).toEqual({
      balances: {
        foo: {
          tez: new BigNumber(33),
          tokens: [],
        },
      },
      operations: { tez: {}, tokens: {} },
      network: "mainnet",
      conversionRate: null,
    });

    store.dispatch(
      update([
        { pkh: "bar", tez: new BigNumber(44) },
        { pkh: "baz", tez: new BigNumber(55) },
      ])
    );

    expect(store.getState().assets).toEqual({
      balances: {
        foo: {
          tez: new BigNumber(33),
          tokens: [],
        },
        bar: {
          tez: new BigNumber(44),
          tokens: [],
        },
        baz: {
          tez: new BigNumber(55),
          tokens: [],
        },
      },
      operations: { tez: {}, tokens: {} },
      network: "mainnet",
      conversionRate: null,
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
        bar: {
          tez: new BigNumber(44),
          tokens: [],
        },
        baz: {
          tez: new BigNumber(66),
          tokens: [],
        },
      },

      operations: { tez: {}, tokens: {} },
      network: "mainnet",
      conversionRate: null,
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
        bar: {
          tez: new BigNumber(44),
          tokens: [],
        },
        baz: {
          tez: new BigNumber(55),
          tokens: [{}, {}],
        },
      },

      operations: { tez: {}, tokens: {} },
      network: "mainnet",
      conversionRate: null,
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
        bar: { tez: BigNumber("44"), tokens: [] },
        baz: { tez: BigNumber("55"), tokens: [] },
        foo: { tez: null, tokens: [{}, {}] },
      },
      network: "mainnet",
      operations: { tez: {}, tokens: {} },
      conversionRate: null,
    });

    store.dispatch(updateNetwork(TezosNetwork.GHOSTNET));

    expect(store.getState().assets).toEqual({
      balances: {},
      operations: { tez: {}, tokens: {} },
      network: "ghostnet",
      conversionRate: null,
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
        bar: { tez: BigNumber("44"), tokens: [] },
        baz: { tez: BigNumber("55"), tokens: [] },
        foo: { tez: null, tokens: [{}, {}] },
      },
      network: "mainnet",
      operations: { tez: {}, tokens: {} },
      conversionRate: null,
    });

    store.dispatch(accountsSlice.actions.reset());

    expect(store.getState().assets).toEqual({
      balances: {},
      operations: { tez: {}, tokens: {} },
      network: "mainnet",
      conversionRate: null,
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
      balances: {},
      network: "mainnet",
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
      balances: {},
      network: "mainnet",
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
      balances: {},
      network: "mainnet",
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
      balances: {},
      network: "mainnet",
      operations: {
        tokens: {
          foo: [mockTokenTransaction(4)],
          bar: [mockTokenTransaction(3)],
          baz: [mockTokenTransaction(5)],
        },
        tez: {},
      },
    });
  });
});
