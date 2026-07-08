import { makeStore } from "@umami/state";
import { getProtocolSettings } from "@umami/tezos";

import { renderHook, waitFor } from "./testUtils";
import { usePollProtocolSettings } from "./usePollProtocolSettings";

jest.mock("@umami/tezos");

describe("usePollProtocolSettings", () => {
  it("derives the unstake finalization delay from pre-Rio constants", async () => {
    const store = makeStore();
    jest.mocked(getProtocolSettings).mockResolvedValue({
      max_slashing_period: 5,
      consensus_rights_delay: 123,
      adaptive_issuance_activation_vote_enable: false,
    } as any);

    renderHook(() => usePollProtocolSettings(), { store });

    await waitFor(() => expect(getProtocolSettings).toHaveBeenCalled());
    expect(store.getState().protocolSettings).toEqual({
      mainnet: {
        unstakeFinalizationDelay: 128,
        consensusRightsDelay: 123,
      },
      ghostnet: {
        unstakeFinalizationDelay: 4,
        consensusRightsDelay: 2,
      },
    });
  });

  it("uses the unstake_finalization_delay constant exposed since Rio (022)", async () => {
    const store = makeStore();
    jest.mocked(getProtocolSettings).mockResolvedValue({
      denunciation_period: 1,
      slashing_delay: 1,
      unstake_finalization_delay: 3,
      consensus_rights_delay: 2,
    } as any);

    renderHook(() => usePollProtocolSettings(), { store });

    await waitFor(() => expect(getProtocolSettings).toHaveBeenCalled());
    expect(store.getState().protocolSettings).toEqual({
      mainnet: {
        unstakeFinalizationDelay: 3,
        consensusRightsDelay: 2,
      },
      ghostnet: {
        unstakeFinalizationDelay: 4,
        consensusRightsDelay: 2,
      },
    });
  });
});
