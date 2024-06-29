import { mockBaker, rawAccountFixture } from "@umami/core";
import { mockImplicitAddress } from "@umami/tezos";
import BigNumber from "bignumber.js";

import {
  useBakerList,
  useGetAccountDelegate,
  useIsBlockFinalised,
  useTotalBalance,
} from "./assets";
import { assetsActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import { renderHook } from "../testUtils";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("useBakerList", () => {
  it("should return bakers in store", () => {
    store.dispatch(assetsActions.updateBakers([mockBaker(1), mockBaker(2)]));

    const { result } = renderHook(useBakerList, { store });

    expect(result.current).toEqual([mockBaker(1), mockBaker(2)]);
  });
});

describe("useTotalBalance", () => {
  it("returns null if there are no balances", () => {
    const { result } = renderHook(() => useTotalBalance(), { store });

    expect(result.current).toBeNull();
  });

  it("returns total balance in both mutez and USD", () => {
    store.dispatch(assetsActions.updateConversionRate(0.5));
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({ address: mockImplicitAddress(0).pkh, balance: 1000000 }),
      ])
    );

    const { result } = renderHook(() => useTotalBalance(), { store });

    expect(result.current).toEqual({ mutez: "1000000", usd: BigNumber("0.5") });
  });
});

describe("useIsBlockFinalised", () => {
  it.each([0, 1])("returns false %d block(s) away", diff => {
    store.dispatch(assetsActions.updateBlock({ level: 10, cycle: 1 }));

    const {
      result: { current: isFinalized },
    } = renderHook(() => useIsBlockFinalised(10 - diff), { store });

    expect(isFinalized).toEqual(false);
  });

  it("returns true 2 blocks away", () => {
    store.dispatch(assetsActions.updateBlock({ level: 10, cycle: 1 }));

    const {
      result: { current: isFinalized },
    } = renderHook(() => useIsBlockFinalised(8), { store });

    expect(isFinalized).toEqual(true);
  });

  it("returns null if current level is not available", () => {
    const {
      result: { current: isFinalized },
    } = renderHook(() => useIsBlockFinalised(8), { store });

    expect(isFinalized).toBeNull();
  });
});

describe("useGetAccountDelegate", () => {
  it("returns undefined if the delegate is not set", () => {
    const {
      result: { current: getDelegate },
    } = renderHook(() => useGetAccountDelegate(), { store });

    expect(getDelegate(mockImplicitAddress(0).pkh)).toBeUndefined();
  });

  it("returns account's delegate", () => {
    const address = mockImplicitAddress(0).pkh;
    const delegateAddress = mockImplicitAddress(1).pkh;
    store.dispatch(
      assetsActions.updateAccountStates([{ address, delegate: delegateAddress } as any])
    );
    const {
      result: { current: getDelegate },
    } = renderHook(() => useGetAccountDelegate(), { store });

    expect(getDelegate(address)).toEqual(delegateAddress);
  });
});
