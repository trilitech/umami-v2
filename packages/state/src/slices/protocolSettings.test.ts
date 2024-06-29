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
      mainnet: { maxSlashingPeriod: 2, consensusRightsDelay: 2 },
      ghostnet: { maxSlashingPeriod: 2, consensusRightsDelay: 2 },
    });
  });

  it("updates the protocol settings", () => {
    store.dispatch(
      protocolSettingsActions.update({
        network: MAINNET,
        settings: {
          maxSlashingPeriod: 3,
          consensusRightsDelay: 3,
        },
      })
    );

    expect(store.getState().protocolSettings).toEqual({
      mainnet: { maxSlashingPeriod: 3, consensusRightsDelay: 3 },
      ghostnet: { maxSlashingPeriod: 2, consensusRightsDelay: 2 },
    });
  });
});
