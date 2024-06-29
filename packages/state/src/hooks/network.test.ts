import { rawAccountFixture } from "@umami/core";
import { GHOSTNET, MAINNET, mockImplicitAddress } from "@umami/tezos";

import {
  useAvailableNetworks,
  useFindNetwork,
  useSelectNetwork,
  useSelectedNetwork,
} from "./network";
import { assetsActions, networksActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import { renderHook } from "../testUtils";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

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
      } = renderHook(() => useSelectedNetwork(), { store });
      expect(current.name).toEqual("ghostnet");
    });
  });

  describe("useAvailableNetworks", () => {
    it("returns default networks by default", () => {
      const {
        result: { current },
      } = renderHook(() => useAvailableNetworks(), { store });
      expect(current).toEqual([MAINNET, GHOSTNET]);
    });

    it("returns custom networks if any", () => {
      const customNetwork = { ...GHOSTNET, name: "custom" };
      store.dispatch(networksActions.upsertNetwork(customNetwork));
      const {
        result: { current },
      } = renderHook(() => useAvailableNetworks(), { store });
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
      } = renderHook(() => useSelectNetwork(), { store });
      selectNetwork("ghostnet");

      expect(store.getState().networks.current.name).toEqual("ghostnet");
      expect(store.getState().assets.accountStates).toEqual({});
    });

    it("does nothing if network is not found", () => {
      const {
        result: { current: selectNetwork },
      } = renderHook(() => useSelectNetwork(), { store });
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
      } = renderHook(() => useFindNetwork(), { store });
      expect(findNetwork("mainnet")).toEqual(MAINNET);
      expect(findNetwork("maiNNet")).toEqual(MAINNET);
    });

    it("returns undefined if network not found", () => {
      const {
        result: { current: findNetwork },
      } = renderHook(() => useFindNetwork(), { store });
      expect(findNetwork("asdasd")).toEqual(undefined);
      expect(findNetwork("mainnetX")).toEqual(undefined);
    });
  });
});
