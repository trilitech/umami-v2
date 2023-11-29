import { networksActions } from "./networks";
import { DefaultNetworks, GHOSTNET, MAINNET } from "../../../types/Network";
import { store } from "../store";

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

  describe("upsertNetwork", () => {
    it("adds new network", () => {
      const newNetwork = { ...GHOSTNET, name: "Another Network" };
      store.dispatch(networksActions.upsertNetwork(newNetwork));
      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, newNetwork]);
    });

    it("makes an update if there is a network with such a name", () => {
      const newNetwork = { ...MAINNET, name: "Another Network" };
      store.dispatch(networksActions.upsertNetwork(newNetwork));
      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, newNetwork]);

      const updatedNetwork = { ...newNetwork, buyTezUrl: undefined };
      store.dispatch(networksActions.upsertNetwork(updatedNetwork));

      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, updatedNetwork]);
    });

    it("does not let you amend default networks", () => {
      store.dispatch(networksActions.upsertNetwork({ ...MAINNET, buyTezUrl: undefined }));
      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET]);
    });
  });

  describe("removeNetwork", () => {
    const newNetwork = { ...GHOSTNET, name: "Another Network" };

    beforeEach(() => {
      store.dispatch(networksActions.upsertNetwork(newNetwork));
      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, newNetwork]);
    });

    it("removes a non-default network", () => {
      store.dispatch(networksActions.removeNetwork(newNetwork));
      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET]);
    });

    it("does nothing if there is no network with such a name", () => {
      store.dispatch(networksActions.removeNetwork({ ...GHOSTNET, name: "test" }));
      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, newNetwork]);
    });

    it("does not let you remove default networks", () => {
      store.dispatch(networksActions.removeNetwork(GHOSTNET));
      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, newNetwork]);
    });
  });
});
