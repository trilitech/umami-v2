import { MAINNET, SHADOWNET } from "@umami/tezos";

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
        settings: { unstakeFinalizationDelay: 6, consensusRightsDelay: 3 },
      })
    );
    store.dispatch(
      protocolSettingsActions.update({
        network: SHADOWNET,
        settings: { unstakeFinalizationDelay: 2, consensusRightsDelay: 1 },
      })
    );

    const {
      result: { current: protocolSettings },
    } = renderHook(() => useGetProtocolSettings(), { store });

    expect(protocolSettings).toEqual({ unstakeFinalizationDelay: 6, consensusRightsDelay: 3 });
  });
});
