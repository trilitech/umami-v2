import { DefaultNetworks, MAINNET, SHADOWNET } from "@umami/tezos";

import { networksActions } from "./networks";
import { type UmamiStore, makeStore } from "../store";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("networksSlice", () => {
  test("initialState", () => {
    expect(store.getState().networks).toEqual({
      available: DefaultNetworks,
      current: MAINNET,
    });
  });

  test("setCurrent", () => {
    store.dispatch(networksActions.setCurrent(SHADOWNET));
    expect(store.getState().networks.current).toEqual(SHADOWNET);
  });

  describe("upsertNetwork", () => {
    it("adds new network", () => {
      const newNetwork = { ...SHADOWNET, name: "Another Network" };
      store.dispatch(networksActions.upsertNetwork(newNetwork));
      expect(store.getState().networks.available).toEqual([MAINNET, SHADOWNET, newNetwork]);
    });

    it("makes an update if there is a network with such a name", () => {
      const newNetwork = { ...MAINNET, name: "Another Network" };
      store.dispatch(networksActions.upsertNetwork(newNetwork));
      expect(store.getState().networks.available).toEqual([MAINNET, SHADOWNET, newNetwork]);

      const updatedNetwork = { ...newNetwork, buyTezUrl: undefined };
      store.dispatch(networksActions.upsertNetwork(updatedNetwork));

      expect(store.getState().networks.available).toEqual([MAINNET, SHADOWNET, updatedNetwork]);
    });

    it("does not let you amend default networks", () => {
      store.dispatch(networksActions.upsertNetwork({ ...MAINNET, buyTezUrl: undefined }));
      expect(store.getState().networks.available).toEqual([MAINNET, SHADOWNET]);
    });

    it("updates current network if it's the one we're updating", () => {
      const newNetwork = { ...MAINNET, name: "Another Network" };
      store.dispatch(networksActions.upsertNetwork(newNetwork));

      store.dispatch(networksActions.setCurrent(newNetwork));
      expect(store.getState().networks.current).toEqual(newNetwork);

      const updatedNetwork = { ...newNetwork, rpcUrl: "something else" };
      store.dispatch(networksActions.upsertNetwork(updatedNetwork));

      expect(store.getState().networks).toEqual({
        available: [MAINNET, SHADOWNET, updatedNetwork],
        current: updatedNetwork,
      });
    });
  });

  describe("removeNetwork", () => {
    const newNetwork = { ...SHADOWNET, name: "Another Network" };

    beforeEach(() => {
      store.dispatch(networksActions.upsertNetwork(newNetwork));
      expect(store.getState().networks.available).toEqual([MAINNET, SHADOWNET, newNetwork]);
    });

    it("removes a non-default network", () => {
      store.dispatch(networksActions.removeNetwork(newNetwork));
      expect(store.getState().networks.available).toEqual([MAINNET, SHADOWNET]);
    });

    it("does nothing if there is no network with such a name", () => {
      store.dispatch(networksActions.removeNetwork({ ...SHADOWNET, name: "test" }));
      expect(store.getState().networks.available).toEqual([MAINNET, SHADOWNET, newNetwork]);
    });

    it("does not let you remove default networks", () => {
      store.dispatch(networksActions.removeNetwork(SHADOWNET));
      expect(store.getState().networks.available).toEqual([MAINNET, SHADOWNET, newNetwork]);
    });
  });
});
