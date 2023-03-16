import assetsSlice from "./store/assetsSlice";
import { store } from "./store/store";

import BigNumber from "bignumber.js";
import { TezosNetwork } from "@airgap/tezos";
import accountsSlice from "./store/accountsSlice";

const {
  actions: { reset, updateAssets: update, updateNetwork },
} = assetsSlice;

afterEach(() => {
  store.dispatch(reset());
});

describe("Assets reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().assets).toEqual({
      balances: {},
      operations: {},
      network: "mainnet",
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
      operations: {},
      network: "mainnet",
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
      operations: {},
      network: "mainnet",
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

      operations: {},
      network: "mainnet",
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

      operations: {},
      network: "mainnet",
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
      operations: {},
    });

    store.dispatch(updateNetwork(TezosNetwork.GHOSTNET));

    expect(store.getState().assets).toEqual({
      balances: {},
      operations: {},
      network: "ghostnet",
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
      operations: {},
    });

    store.dispatch(accountsSlice.actions.reset());

    expect(store.getState().assets).toEqual({
      balances: {},
      operations: {},
      network: "mainnet",
    });
  });
});
