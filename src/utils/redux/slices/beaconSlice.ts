import { NetworkType } from "@airgap/beacon-wallet";
import { createSlice } from "@reduxjs/toolkit";
import { setWith } from "lodash";

import { RawPkh } from "../../../types/Address";

type State = Record<string, Record<RawPkh, NetworkType>>;

export const initialState: State = {};

/**
 * Stores connection info between dApps and accounts.
 *
 * dApps are identified by dAppId (a unique string id generated from dApp public key).
 * Connection is identified by a pair of (dAppId, accountPkh).
 *
 * NetworkType is stored for convinience as dApps for different networks will have diferent dAppIds.
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
      setWith(state, [payload.dAppId, payload.accountPkh], payload.networkType);
    },

    removeConnection: (state, { payload }: { payload: { dAppId: string; accountPkh: RawPkh } }) => {
      delete state[payload.dAppId][payload.accountPkh];
      if (Object.keys(state[payload.dAppId]).length === 0) {
        delete state[payload.dAppId];
      }
    },
  },
});

export const beaconActions = beaconSlice.actions;
