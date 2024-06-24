import { mockImplicitAddress, rawAccountFixture } from "@umami/test-utils";

import { useGetAccountStakedBalance, useGetAccountUnstakeRequests } from "./stakingHooks";
import { renderHook } from "../../mocks/testUtils";
import { assetsActions } from "../redux/slices/assetsSlice";
import { store } from "../redux/store";

const address = mockImplicitAddress(0).pkh;

describe("stakingHooks", () => {
  describe("useGetAccountStakedBalance", () => {
    it("returns 0 for an account with no staked balance", () => {
      const {
        result: { current: balance },
      } = renderHook(() => useGetAccountStakedBalance(address));

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
      } = renderHook(() => useGetAccountStakedBalance(address));

      expect(balance).toEqual(123);
    });
  });

  describe("useGetAccountUnstakeRequests", () => {
    it("returns an empty array for an account with no unstake requests info", () => {
      const {
        result: { current: balance },
      } = renderHook(() => useGetAccountUnstakeRequests(address));

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
      } = renderHook(() => useGetAccountUnstakeRequests(address));

      expect(balance).toEqual([
        {
          cycle: 1,
          amount: 123,
          status: "pending",
        },
      ]);
    });
  });
});
