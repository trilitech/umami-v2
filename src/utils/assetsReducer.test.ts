import assetsSlice from "./store/assetsSlice";
import { store } from "./store/store";

import BigNumber from "bignumber.js";

const {
  actions: { reset, updateAssets: update },
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
});
