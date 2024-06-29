import { GHOSTNET, MAINNET } from "@umami/tezos";

import { useGetProtocolSettings } from "./protocolSettings";
import { protocolSettingsActions } from "../slices";
import { store } from "../store";
import { renderHook } from "../testUtils";

describe("useGetProtocolSettings", () => {
  it("returns the protocol settings for the selected network", () => {
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
    } = renderHook(() => useGetProtocolSettings());

    expect(protocolSettings).toEqual({ maxSlashingPeriod: 3, consensusRightsDelay: 3 });
  });
});
