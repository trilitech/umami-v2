import { accountsSlice } from "./accountsSlice";
import { assetsSlice } from "./assetsSlice";
import { hedgehoge } from "../../../mocks/fa12Tokens";
import { mockImplicitAddress, mockTokenTransaction } from "../../../mocks/factories";
import { store } from "../store";

const {
  actions: { updateTezBalance, updateTokenBalance, updateTokenTransfers },
} = assetsSlice;

describe("assetsSlice", () => {
  it("initialized with empty state", () => {
    expect(store.getState().assets).toEqual({
      balances: {
        mutez: {},
        tokens: {},
      },
      transfers: { tez: {}, tokens: {} },
      delegationLevels: {},
      conversionRate: null,
      bakers: [],
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  it("resets state on reset", () => {
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
      delegationLevels: {},
      bakers: [],
      conversionRate: null,
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  describe("updateTezBalance", () => {
    it("replaces tez balances", () => {
      store.dispatch(updateTezBalance([{ address: "foo", balance: 43 }]));

      expect(store.getState().assets).toEqual({
        balances: {
          mutez: {
            foo: "43",
          },
          tokens: {},
        },
        transfers: { tez: {}, tokens: {} },
        delegationLevels: {},
        conversionRate: null,
        bakers: [],
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
        delegationLevels: {},
        conversionRate: null,
        bakers: [],
        blockLevel: null,
        refetchTrigger: 0,
        lastTimeUpdated: null,
        isLoading: false,
      });
    });

    it("updates tez balances", () => {
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
        delegationLevels: {},
        bakers: [],
        transfers: { tez: {}, tokens: {} },
        blockLevel: null,
        refetchTrigger: 0,
        lastTimeUpdated: null,
        isLoading: false,
      });
    });

    it("sets up delegation levels", () => {
      store.dispatch(
        updateTezBalance([
          { address: "bar", balance: 44, delegationLevel: 5 },
          { address: "baz", balance: 55 },
        ])
      );
      expect(store.getState().assets.delegationLevels).toEqual({
        bar: 5,
      });
    });
  });

  describe("updateTokenBalance", () => {
    it("sets up token balances", () => {
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
                lastLevel: 1477579,
              },
            ],
          },
        },
        conversionRate: null,
        delegationLevels: {},
        bakers: [],
        transfers: { tez: {}, tokens: {} },
        blockLevel: null,
        refetchTrigger: 0,
        lastTimeUpdated: null,
        isLoading: false,
      });
    });
  });

  describe("updateTokenTransfer", () => {
    it("sets up token transfers on token transfer update", () => {
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
});
