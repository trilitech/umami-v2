import { mockBaker, rawAccountFixture } from "@umami/core";
import { assetsActions, assetsSlice, store } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";
import BigNumber from "bignumber.js";

import { useBakerList, useTotalBalance } from "./assetsHooks";
import { renderHook } from "../../mocks/testUtils";

describe("useBakerList", () => {
  it("should return bakers in store", () => {
    store.dispatch(assetsSlice.actions.updateBakers([mockBaker(1), mockBaker(2)]));

    const { result } = renderHook(useBakerList);

    expect(result.current).toEqual([mockBaker(1), mockBaker(2)]);
  });
});

describe("useTotalBalance", () => {
  it("returns null if there are no balances", () => {
    const { result } = renderHook(() => useTotalBalance());

    expect(result.current).toBeNull();
  });

  it("returns total balance in both mutez and USD", () => {
    store.dispatch(assetsActions.updateConversionRate(0.5));
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({ address: mockImplicitAddress(0).pkh, balance: 1000000 }),
      ])
    );

    const { result } = renderHook(() => useTotalBalance());

    expect(result.current).toEqual({ mutez: "1000000", usd: BigNumber("0.5") });
  });
});
