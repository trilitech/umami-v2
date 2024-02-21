import { useBakerList } from "./assetsHooks";
import { mockBaker } from "../../mocks/factories";
import { renderHook } from "../../mocks/testUtils";
import { assetsSlice } from "../redux/slices/assetsSlice";
import { store } from "../redux/store";

describe("useBakerList", () => {
  it("should return bakers in store", () => {
    store.dispatch(assetsSlice.actions.updateBakers([mockBaker(1), mockBaker(2)]));

    const { result } = renderHook(useBakerList);

    expect(result.current).toEqual([mockBaker(1), mockBaker(2)]);
  });
});