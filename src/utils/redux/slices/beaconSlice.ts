import { NetworkType } from "@airgap/beacon-wallet";
import { createSlice } from "@reduxjs/toolkit";
import { fromPairs } from "lodash";

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

    removeConnection: (state, { payload: dAppId }: { payload: string }) => {
      delete state[dAppId];
    },

    removeConnections: (state, { payload: pkhs }: { payload: RawPkh[] }) =>
      fromPairs(
        Object.entries(state).filter(
          ([_, connectionInfo]) => !pkhs.includes(connectionInfo.accountPkh)
        )
      ),
  },
});

export const beaconActions = beaconSlice.actions;
