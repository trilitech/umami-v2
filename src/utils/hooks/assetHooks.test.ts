import { TezosNetwork } from "@airgap/tezos";
import { renderHook } from "@testing-library/react";
import { mockBaker } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import assetsSlice from "../store/assetsSlice";
import { store } from "../store/store";
import { useBakerList } from "./assetsHooks";

describe("useBakerList", () => {
  it("should return bakers on mainnet", () => {
    store.dispatch(assetsSlice.actions.updateNetwork(TezosNetwork.MAINNET));
    store.dispatch(assetsSlice.actions.updateBakers([mockBaker(1), mockBaker(2)]));

    const { result } = renderHook(useBakerList, {
      wrapper: ReduxStore,
    });

    expect(result.current).toEqual([mockBaker(1), mockBaker(2)]);
  });

  it("should return empty list on ghostnet", () => {
    store.dispatch(assetsSlice.actions.updateNetwork(TezosNetwork.GHOSTNET));
    store.dispatch(assetsSlice.actions.updateBakers([mockBaker(1), mockBaker(2)]));

    const { result } = renderHook(useBakerList, {
      wrapper: ReduxStore,
    });

    expect(result.current).toEqual([]);
  });
});
