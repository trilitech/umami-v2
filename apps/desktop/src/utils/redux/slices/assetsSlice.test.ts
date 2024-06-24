import {
  hedgehoge,
  mockImplicitAddress,
  mockTokenTransaction,
  rawAccountFixture,
} from "@umami/test-utils";

import { accountsSlice } from "./accountsSlice/accountsSlice";
import { assetsSlice } from "./assetsSlice";
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
        rawAccountFixture({
          address: "bar",
          balance: 44,
          stakedBalance: 123,
          unstakedBalance: 321,
          delegate: null,
        }),
        rawAccountFixture({
          address: "baz",
          balance: 55,
          stakedBalance: 123,
          unstakedBalance: 321,
          delegate: null,
        }),
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
        rawAccountFixture({
          address: "foo",
          balance: 4391,
          stakedBalance: 123,
          unstakedBalance: 321,
          delegate: { address: "foo" },
        }),
        rawAccountFixture({
          address: "baz",
          balance: 9595,
          stakedBalance: 1234,
          unstakedBalance: 4321,
          delegate: null,
        }),
      ])
    );

    expect(store.getState().assets.accountStates).toEqual({
      foo: {
        balance: 3947,
        stakedBalance: 123,
        delegate: { address: "foo" },
      },
      baz: {
        balance: 4040,
        stakedBalance: 1234,
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
        {
          staker: { address: "foo" },
          amount: 123,
          cycle: 5,
          status: "finalizable",
        },
        {
          staker: { address: "foo" },
          amount: 123,
          cycle: 1,
          status: "finalizable",
        },
        {
          staker: { address: "bar" },
          amount: 321,
          cycle: 1,
          status: "finalizable",
        },
      ])
    );

    expect(store.getState().assets.accountStates).toEqual({
      foo: {
        unstakeRequests: [
          { amount: 123, cycle: 1, status: "finalizable" },
          { amount: 123, cycle: 5, status: "finalizable" }, // older comes last
        ],
      },
      bar: { unstakeRequests: [{ amount: 321, cycle: 1, status: "finalizable" }] },
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
        rawAccountFixture({
          address: "foo",
          balance: 500,
          stakedBalance: 123,
          unstakedBalance: 321,
          delegate: null,
        }),
        rawAccountFixture({
          address: "bar",
          balance: 22,
          stakedBalance: 123,
          unstakedBalance: 321,
          delegate: null,
        }),
        rawAccountFixture({
          address: "baz",
          balance: 33,
          stakedBalance: 123,
          unstakedBalance: 321,
          delegate: null,
        }),
      ])
    );

    store.dispatch(removeAccountsData(["bar", "baz", "qwerty"]));

    expect(store.getState().assets.accountStates).toEqual({
      foo: {
        balance: 56,
        delegate: null,
        stakedBalance: 123,
      },
    });
  });
});
