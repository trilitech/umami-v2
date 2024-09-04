import { rawAccountFixture } from "@umami/core";
import { MAINNET, mockImplicitAddress } from "@umami/tezos";
import { BigNumber } from "bignumber.js";

import {
  useAccountPendingUnstakeRequests,
  useAccountTotalFinalizableUnstakeAmount,
  useGetAccountStakedBalance,
  useGetAccountUnstakeRequests,
  useGetFirstFinalizableCycle,
} from "./staking";
import { assetsActions, protocolSettingsActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import { renderHook } from "../testUtils";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

const address = mockImplicitAddress(0).pkh;

describe("stakingHooks", () => {
  describe("useGetAccountStakedBalance", () => {
    it("returns 0 for an account with no staked balance", () => {
      const {
        result: { current: balance },
      } = renderHook(() => useGetAccountStakedBalance(address), { store });

      expect(balance).toEqual(0);
    });

    it("should return the staked balance of the account", () => {
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address,
            balance: 1000,
            stakedBalance: 123,
            unstakedBalance: 321,
            delegate: null,
          }),
        ])
      );

      const {
        result: { current: balance },
      } = renderHook(() => useGetAccountStakedBalance(address), { store });

      expect(balance).toEqual(123);
    });
  });

  describe("useGetAccountUnstakeRequests", () => {
    it("returns an empty array for an account with no unstake requests info", () => {
      const {
        result: { current: balance },
      } = renderHook(() => useGetAccountUnstakeRequests(address), { store });

      expect(balance).toEqual([]);
    });

    it("should return the staked balance of the account", () => {
      store.dispatch(
        assetsActions.updateUnstakeRequests([
          {
            cycle: 1,
            amount: 123,
            staker: { address },
            status: "pending",
          },
        ])
      );

      const {
        result: { current: balance },
      } = renderHook(() => useGetAccountUnstakeRequests(address), { store });

      expect(balance).toEqual([
        {
          cycle: 1,
          amount: 123,
          status: "pending",
        },
      ]);
    });
  });

  test("useGetFirstFinalizableCycle", () => {
    store.dispatch(
      protocolSettingsActions.update({
        network: MAINNET,
        settings: {
          maxSlashingPeriod: 5,
          consensusRightsDelay: 11,
        },
      })
    );

    const {
      result: { current: getFirstFinalizableCycle },
    } = renderHook(() => useGetFirstFinalizableCycle(), { store });

    expect(getFirstFinalizableCycle(10)).toEqual(26);
  });

  test("useAccountPendingUnstakeRequests", () => {
    store.dispatch(
      assetsActions.updateUnstakeRequests([
        {
          cycle: 1,
          amount: 123,
          staker: { address },
          status: "pending",
        },
        {
          cycle: 1,
          amount: 567,
          staker: { address },
          status: "pending",
        },
        {
          cycle: 2,
          amount: 12345,
          staker: { address },
          status: "finalizable",
        },
        {
          cycle: 5,
          amount: 10,
          staker: { address },
          status: "finalized",
        },
      ])
    );

    const {
      result: { current: pendingUnstakeRequests },
    } = renderHook(() => useAccountPendingUnstakeRequests(address), { store });

    expect(pendingUnstakeRequests).toEqual([
      {
        cycle: 1,
        amount: 123,
        status: "pending",
      },
      {
        cycle: 1,
        amount: 567,
        status: "pending",
      },
    ]);

    const {
      result: { current: anotherAccountPendingUnstakeRequests },
    } = renderHook(() => useAccountPendingUnstakeRequests(mockImplicitAddress(1).pkh), { store });

    expect(anotherAccountPendingUnstakeRequests).toEqual([]);
  });

  describe("useAccountTotalFinalizableUnstakeAmount", () => {
    it("returns 0 if a user doesn't have any finalizable unstakes", () => {
      const {
        result: { current: total },
      } = renderHook(() => useAccountTotalFinalizableUnstakeAmount(address), { store });

      expect(total).toEqual(BigNumber(0));
    });

    it("returns a sum of finalizable unstakes", () => {
      store.dispatch(
        assetsActions.updateUnstakeRequests([
          {
            cycle: 1,
            amount: 123,
            staker: { address },
            status: "pending",
          },
          {
            cycle: 1,
            amount: 567,
            staker: { address },
            status: "finalizable",
          },
          {
            cycle: 2,
            amount: 12345,
            staker: { address },
            status: "finalizable",
          },
          {
            cycle: 5,
            amount: 10,
            staker: { address },
            status: "finalized",
          },
        ])
      );

      const {
        result: { current: total },
      } = renderHook(() => useAccountTotalFinalizableUnstakeAmount(address), { store });

      expect(total).toEqual(BigNumber(12912));
    });
  });
});
