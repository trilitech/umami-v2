import { renderHook } from "@testing-library/react";
import store from "../redux/store";
import { useAvailableNetworks, useSelectNetwork, useSelectedNetwork } from "./networkHooks";
import { AllTheProviders } from "../../mocks/testUtils";
import { networksActions } from "../redux/slices/networks";
import { GHOSTNET, MAINNET } from "../../types/Network";

describe("networkHooks", () => {
  describe("useSelectedNetwork", () => {
    it("returns mainnet by default", () => {
      const {
        result: { current },
      } = renderHook(() => useSelectedNetwork(), { wrapper: AllTheProviders });
      expect(current.name).toEqual("mainnet");
    });

    it("returns selected network", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));

      const {
        result: { current },
      } = renderHook(() => useSelectedNetwork(), { wrapper: AllTheProviders });
      expect(current.name).toEqual("ghostnet");
    });
  });

  describe("useAvailableNetworks", () => {
    it("returns default networks by default", () => {
      const {
        result: { current },
      } = renderHook(() => useAvailableNetworks(), { wrapper: AllTheProviders });
      expect(current).toEqual([MAINNET, GHOSTNET]);
    });

    it("returns custom networks if any", () => {
      const customNetwork = { ...GHOSTNET, name: "custom" };
      store.dispatch(networksActions.upsertNetwork(customNetwork));
      const {
        result: { current },
      } = renderHook(() => useAvailableNetworks(), { wrapper: AllTheProviders });
      expect(current).toEqual([MAINNET, GHOSTNET, customNetwork]);
    });
  });

  test("useSelectNetwork", () => {
    const {
      result: { current: selectNetwork },
    } = renderHook(() => useSelectNetwork(), { wrapper: AllTheProviders });
    selectNetwork("ghostnet");

    const {
      result: { current },
    } = renderHook(() => useSelectedNetwork(), { wrapper: AllTheProviders });
    expect(current.name).toEqual("ghostnet");
  });
});
