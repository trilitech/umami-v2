import { createSlice } from "@reduxjs/toolkit";
import { fromPairs } from "lodash";

import { DefaultNetworks, type Network, type NetworkName } from "../../../types/Network";

export type ProtocolSettings = {
  maxSlashingPeriod: number;
  consensusRightsDelay: number;
};

type State = Record<NetworkName, ProtocolSettings>;

export const initialState: State = fromPairs(
  DefaultNetworks.map(network => [network.name, { maxSlashingPeriod: 2, consensusRightsDelay: 2 }])
);

// TODO: test
export const protocolSettingsSlice = createSlice({
  name: "protocolSettings",
  initialState,
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
