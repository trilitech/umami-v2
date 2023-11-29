import { renderHook } from "@testing-library/react";
import { mockBaker } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import { assetsSlice } from "../redux/slices/assetsSlice";
import { store } from "../redux/store";
import { useBakerList } from "./assetsHooks";

describe("useBakerList", () => {
  it("should return bakers in store", () => {
    store.dispatch(assetsSlice.actions.updateBakers([mockBaker(1), mockBaker(2)]));

    const { result } = renderHook(useBakerList, {
      wrapper: ReduxStore,
    });

    expect(result.current).toEqual([mockBaker(1), mockBaker(2)]);
  });
});
