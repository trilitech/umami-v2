import { MAINNET } from "@umami/tezos";

import { protocolSettingsActions } from "./protocolSettings";
import { type UmamiStore, makeStore } from "../store";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("protocolSettingsSlice", () => {
  test("initial state", () => {
    expect(store.getState().protocolSettings).toEqual({
      mainnet: { unstakeFinalizationDelay: 4, consensusRightsDelay: 2 },
      shadownet: { unstakeFinalizationDelay: 4, consensusRightsDelay: 2 },
    });
  });

  it("updates the protocol settings", () => {
    store.dispatch(
      protocolSettingsActions.update({
        network: MAINNET,
        settings: {
          unstakeFinalizationDelay: 6,
          consensusRightsDelay: 3,
        },
      })
    );

    expect(store.getState().protocolSettings).toEqual({
      mainnet: { unstakeFinalizationDelay: 6, consensusRightsDelay: 3 },
      shadownet: { unstakeFinalizationDelay: 4, consensusRightsDelay: 2 },
    });
  });
});
