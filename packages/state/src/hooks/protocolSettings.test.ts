import { GHOSTNET, MAINNET } from "@umami/tezos";

import { useGetProtocolSettings } from "./protocolSettings";
import { protocolSettingsActions } from "../slices";
import { makeStore } from "../store";
import { renderHook } from "../testUtils";

describe("useGetProtocolSettings", () => {
  it("returns the protocol settings for the selected network", () => {
    const store = makeStore();
    store.dispatch(
      protocolSettingsActions.update({
        network: MAINNET,
        settings: { maxSlashingPeriod: 3, consensusRightsDelay: 3 },
      })
    );
    store.dispatch(
      protocolSettingsActions.update({
        network: GHOSTNET,
        settings: { maxSlashingPeriod: 1, consensusRightsDelay: 1 },
      })
    );

    const {
      result: { current: protocolSettings },
    } = renderHook(() => useGetProtocolSettings(), { store });

    expect(protocolSettings).toEqual({ maxSlashingPeriod: 3, consensusRightsDelay: 3 });
  });
});
