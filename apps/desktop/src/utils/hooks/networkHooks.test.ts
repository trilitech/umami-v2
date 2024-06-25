import { mockImplicitAddress, rawAccountFixture } from "@umami/test-utils";
import { GHOSTNET, MAINNET } from "@umami/tezos";

import {
  useAvailableNetworks,
  useFindNetwork,
  useSelectNetwork,
  useSelectedNetwork,
} from "./networkHooks";
import { renderHook } from "../../mocks/testUtils";
import { assetsActions } from "../redux/slices/assetsSlice";
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

  describe("useSelectNetwork", () => {
    beforeEach(() =>
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            balance: 10000,
            delegate: null,
            stakedBalance: 1,
            unstakedBalance: 1234,
          }),
        ])
      )
    );

    it("changes the current network", () => {
      const {
        result: { current: selectNetwork },
      } = renderHook(() => useSelectNetwork());
      selectNetwork("ghostnet");

      expect(store.getState().networks.current.name).toEqual("ghostnet");
      expect(store.getState().assets.accountStates).toEqual({});
    });

    it("does nothing if network is not found", () => {
      const {
        result: { current: selectNetwork },
      } = renderHook(() => useSelectNetwork());
      selectNetwork("ghostnet234");

      expect(store.getState().networks.current.name).toEqual("mainnet");
      expect(store.getState().assets.accountStates).toEqual({
        [mockImplicitAddress(0).pkh]: {
          balance: 8765,
          delegate: null,
          stakedBalance: 1,
        },
      });
    });
  });

  describe("useFindNetwork", () => {
    it("finds network by name", () => {
      const {
        result: { current: findNetwork },
      } = renderHook(() => useFindNetwork());
      expect(findNetwork("mainnet")).toEqual(MAINNET);
      expect(findNetwork("maiNNet")).toEqual(MAINNET);
    });

    it("returns undefined if network not found", () => {
      const {
        result: { current: findNetwork },
      } = renderHook(() => useFindNetwork());
      expect(findNetwork("asdasd")).toEqual(undefined);
      expect(findNetwork("mainnetX")).toEqual(undefined);
    });
  });
});
