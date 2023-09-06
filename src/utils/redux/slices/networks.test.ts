import { DefaultNetworks, GHOSTNET, MAINNET } from "../../../types/Network";
import store from "../store";
import { networksActions } from "./networks";

describe("networksSlice", () => {
  test("initialState", () => {
    expect(store.getState().networks).toEqual({
      available: DefaultNetworks,
      current: MAINNET,
    });
  });

  test("setCurrent", () => {
    store.dispatch(networksActions.setCurrent(GHOSTNET));
    expect(store.getState().networks.current).toEqual(GHOSTNET);
  });
});
