import { accountsSlice } from "./accountsSlice/accountsSlice";
import { assetsSlice } from "./assetsSlice";
import { hedgehoge } from "../../../mocks/fa12Tokens";
import { mockImplicitAddress, mockTokenTransaction } from "../../../mocks/factories";
import { store } from "../store";

const {
  actions: { removeAccountsData, updateAccountStates, updateTokenBalance, updateTokenTransfers },
} = assetsSlice;

describe("assetsSlice", () => {
  it("is initialized with empty state", () => {
    expect(store.getState().assets).toEqual({
      accountStates: {},
      transfers: { tokens: {} },
      conversionRate: undefined,
      bakers: [],
      block: {},
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  it("resets state on reset", () => {
    store.dispatch(
      updateAccountStates([
        { address: "bar", balance: 44, stakedBalance: 123, unstakedBalance: 321, delegate: null },
        { address: "baz", balance: 55, stakedBalance: 123, unstakedBalance: 321, delegate: null },
      ])
    );
    store.dispatch(updateTokenBalance([hedgehoge(mockImplicitAddress(0))]));

    store.dispatch(accountsSlice.actions.reset());

    expect(store.getState().assets).toEqual({
      accountStates: {},
      transfers: { tokens: {} },
      bakers: [],
      conversionRate: undefined,
      block: {},
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  describe("updateAccountStates", () => {
    it("replaces tez balances", () => {
      store.dispatch(
        updateAccountStates([
          {
            address: "foo",
            balance: 43,
            stakedBalance: 123,
            unstakedBalance: 321,
            delegate: { address: "foo" },
          },
          {
            address: "baz",
            balance: 55,
            stakedBalance: 1234,
            unstakedBalance: 4321,
            delegate: null,
          },
        ])
      );

      expect(store.getState().assets.accountStates).toEqual({
        foo: {
          balance: 43,
          stakedBalance: 123,
          unstakedBalance: 321,
          delegate: { address: "foo" },
        },
        baz: {
          balance: 55,
          stakedBalance: 1234,
          unstakedBalance: 4321,
          delegate: null,
        },
      });
    });
  });

  describe("updateTokenBalance", () => {
    it("sets up token balances", () => {
      store.dispatch(updateTokenBalance([hedgehoge(mockImplicitAddress(0))]));

      expect(store.getState().assets).toEqual({
        accountStates: {
          [mockImplicitAddress(0).pkh]: {
            tokens: [
              {
                balance: "10000000000",
                contract: "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9",
                tokenId: "0",
                lastLevel: 1477579,
              },
            ],
          },
        },
        conversionRate: undefined,
        bakers: [],
        transfers: { tokens: {} },
        block: {},
        refetchTrigger: 0,
        lastTimeUpdated: null,
        isLoading: false,
      });
    });
  });

  describe("updateTokenTransfers", () => {
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

  describe("removeAccountsData", () => {
    it("removes accounts info for listed accounts", () => {
      store.dispatch(
        updateAccountStates([
          { address: "foo", balance: 11, stakedBalance: 123, unstakedBalance: 321, delegate: null },
          { address: "bar", balance: 22, stakedBalance: 123, unstakedBalance: 321, delegate: null },
          { address: "baz", balance: 33, stakedBalance: 123, unstakedBalance: 321, delegate: null },
        ])
      );

      store.dispatch(removeAccountsData(["bar", "baz", "qwerty"]));

      expect(store.getState().assets.accountStates).toEqual({
        foo: {
          balance: 11,
          delegate: null,
          stakedBalance: 123,
          unstakedBalance: 321,
        },
      });
    });
  });
});
