import { accountsSlice } from "./accountsSlice/accountsSlice";
import { assetsSlice } from "./assetsSlice";
import { hedgehoge } from "../../../mocks/fa12Tokens";
import { mockImplicitAddress, mockTokenTransaction } from "../../../mocks/factories";
import { store } from "../store";

const {
  actions: {
    updateBlock,
    updateUnstakeRequests,
    removeAccountsData,
    updateAccountStates,
    updateTokenBalance,
    updateTokenTransfers,
  },
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

  test("updateAccountStates", () => {
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

  test("updateBlock", () => {
    store.dispatch(updateBlock({ level: 123, cycle: 321 }));

    expect(store.getState().assets.block).toEqual({ level: 123, cycle: 321 });
  });

  test("updateUnstakeRequests", () => {
    store.dispatch(
      updateUnstakeRequests([
        { staker: "foo", requestedAmount: 123, timestamp: "2024-05-25T00:14:37Z", cycle: 5 },
        { staker: "foo", requestedAmount: 123, timestamp: "2024-05-23T00:14:37Z", cycle: 1 },
        { staker: "bar", requestedAmount: 321, timestamp: "2024-05-23T00:14:37Z", cycle: 1 },
      ])
    );

    expect(store.getState().assets.accountStates).toEqual({
      foo: {
        unstakeRequests: [
          { requestedAmount: 123, timestamp: "2024-05-23T00:14:37Z", cycle: 1 },
          { requestedAmount: 123, timestamp: "2024-05-25T00:14:37Z", cycle: 5 }, // older comes last
        ],
      },
      bar: {
        unstakeRequests: [{ requestedAmount: 321, timestamp: "2024-05-23T00:14:37Z", cycle: 1 }],
      },
    });
  });

  test("updateTokenBalance", () => {
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

  test("updateTokenTransfers", () => {
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

  test("removeAccountsData", () => {
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
