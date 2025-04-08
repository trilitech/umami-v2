import { makeStore } from "@umami/state";
import { getProtocolSettings } from "@umami/tezos";

import { renderHook, waitFor } from "./testUtils";
import { usePollProtocolSettings } from "./usePollProtocolSettings";

jest.mock("@umami/tezos");

describe("usePollProtocolSettings", () => {
  it("fetches the latest block and updates the state", async () => {
    const store = makeStore();
    jest.mocked(getProtocolSettings).mockResolvedValue({
      denunciation_period: 1,
      slashing_delay: 1,
      consensus_rights_delay: 123,
      adaptive_issuance_activation_vote_enable: false,
    } as any);

    renderHook(() => usePollProtocolSettings(), { store });

    await waitFor(() => expect(getProtocolSettings).toHaveBeenCalled());
    expect(store.getState().protocolSettings).toEqual({
      mainnet: {
        maxSlashingPeriod: 2,
        consensusRightsDelay: 123,
      },
      ghostnet: {
        maxSlashingPeriod: 2,
        consensusRightsDelay: 2,
      },
    });
  });
});
