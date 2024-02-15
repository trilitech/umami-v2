import { useAvailableNetworks, useSelectNetwork, useSelectedNetwork } from "./networkHooks";
import { renderHook } from "../../mocks/testUtils";
import { GHOSTNET, MAINNET } from "../../types/Network";
import { networksActions } from "../redux/slices/networks";
import { store } from "../redux/store";

describe("networkHooks", () => {
  describe("useSelectedNetwork", () => {
    it("returns mainnet by default", () => {
      const {
        result: { current },
      } = renderHook(() => useSelectedNetwork());
      expect(current.name).toEqual("mainnet");
    });

    it("returns selected network", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));

      const {
        result: { current },
      } = renderHook(() => useSelectedNetwork());
      expect(current.name).toEqual("ghostnet");
    });
  });

  describe("useAvailableNetworks", () => {
    it("returns default networks by default", () => {
      const {
        result: { current },
      } = renderHook(() => useAvailableNetworks());
      expect(current).toEqual([MAINNET, GHOSTNET]);
    });

    it("returns custom networks if any", () => {
      const customNetwork = { ...GHOSTNET, name: "custom" };
      store.dispatch(networksActions.upsertNetwork(customNetwork));
      const {
        result: { current },
      } = renderHook(() => useAvailableNetworks());
      expect(current).toEqual([MAINNET, GHOSTNET, customNetwork]);
    });
  });

  test("useSelectNetwork", () => {
    const {
      result: { current: selectNetwork },
    } = renderHook(() => useSelectNetwork());
    selectNetwork("ghostnet");

    const {
      result: { current },
    } = renderHook(() => useSelectedNetwork());
    expect(current.name).toEqual("ghostnet");
  });
});
