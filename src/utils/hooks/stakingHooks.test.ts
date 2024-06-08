import { useGetAccountStakedBalance, useGetAccountUnstakeRequests } from "./stakingHooks";
import { mockImplicitAddress } from "../../mocks/factories";
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
          {
            address,
            balance: 10,
            stakedBalance: 123,
            unstakedBalance: 321,
            delegate: null,
          },
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
            finalizableAmount: 123,
            staker: { address },
          },
        ])
      );

      const {
        result: { current: balance },
      } = renderHook(() => useGetAccountUnstakeRequests(address));

      expect(balance).toEqual([
        {
          cycle: 1,
          finalizableAmount: 123,
        },
      ]);
    });
  });
});
