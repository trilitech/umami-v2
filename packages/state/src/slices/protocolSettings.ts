import { createSlice } from "@reduxjs/toolkit";
import { DefaultNetworks, type Network, type NetworkName } from "@umami/tezos";
import { fromPairs } from "lodash";

type ProtocolSettings = {
  // cycles until an unstake request becomes finalizable; exposed directly by the RPC
  // since Rio (022), previously max_slashing_period + consensus_rights_delay
  unstakeFinalizationDelay: number;
  consensusRightsDelay: number;
};

type State = Record<NetworkName, ProtocolSettings>;

export const protocolSettingsInitialState: State = fromPairs(
  DefaultNetworks.map(network => [
    network.name,
    { unstakeFinalizationDelay: 4, consensusRightsDelay: 2 },
  ])
);

export const protocolSettingsSlice = createSlice({
  name: "protocolSettings",
  initialState: protocolSettingsInitialState,
  reducers: {
    update: (
      state,
      {
        payload: { network, settings },
      }: { payload: { network: Network; settings: ProtocolSettings } }
    ) => {
      state[network.name] = settings;
    },
  },
});

export const protocolSettingsActions = protocolSettingsSlice.actions;
