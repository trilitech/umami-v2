import { NetworkType } from "@airgap/beacon-wallet";
import { createSlice } from "@reduxjs/toolkit";

import { RawPkh } from "../../../types/Address";

export type DAppConnectionInfo = {
  accountPkh: RawPkh;
  networkType: NetworkType;
};

type State = Record<string, DAppConnectionInfo>;

export const initialState: State = {};

/**
 * Stores connection info between dApps and accounts.
 *
 * dApps are identified by dAppId (a unique string id generated from dApp public key).
 */
export const beaconSlice = createSlice({
  name: "beacon",
  initialState,
  reducers: {
    reset: () => initialState,

    addConnection: (
      state,
      { payload }: { payload: { dAppId: string; accountPkh: RawPkh; networkType: NetworkType } }
    ) => {
      state[payload.dAppId] = { accountPkh: payload.accountPkh, networkType: payload.networkType };
    },

    removeConnection: (state, { payload }: { payload: { dAppId: string } }) => {
      delete state[payload.dAppId];
    },
  },
});

export const beaconActions = beaconSlice.actions;
