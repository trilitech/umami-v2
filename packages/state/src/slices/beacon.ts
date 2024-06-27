import { type NetworkType } from "@airgap/beacon-wallet";
import { createSlice } from "@reduxjs/toolkit";
import { type RawPkh } from "@umami/tezos";
import { fromPairs } from "lodash";

export type DAppConnectionInfo = {
  accountPkh: RawPkh;
  networkType: NetworkType;
};

type State = Record<string, DAppConnectionInfo>;

export const beaconInitialState: State = {};

/**
 * Stores connection info between dApps and accounts.
 *
 * dApps are identified by dAppId (a unique string id generated from dApp public key).
 */
export const beaconSlice = createSlice({
  name: "beacon",
  initialState: beaconInitialState,
  reducers: {
    reset: () => beaconInitialState,

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
