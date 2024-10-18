import { createSlice } from "@reduxjs/toolkit";
import { type NetworkName, type RawPkh } from "@umami/tezos";
import { fromPairs } from "lodash";

export type DAppWcConnectionInfo = {
  accountPkh: RawPkh;
  networkName: NetworkName;
};

// mapping topic -> connection info
type State = Record<string, DAppWcConnectionInfo>;

export const wcInitialState: State = {};

/**
 * Stores connection info between dApps and accounts.
 *
 * dApps are identified by topic (a unique string id generated from dApp public key).
 */
export const wcSlice = createSlice({
  name: "walletconnect",
  initialState: wcInitialState,
  reducers: {
    reset: () => wcInitialState,

    addConnection: (
      state,
      { payload }: { payload: { topic: string; accountPkh: RawPkh; networkName: NetworkName } }
    ) => {
      state[payload.topic] = { accountPkh: payload.accountPkh, networkName: payload.networkName };
    },

    removeConnection: (state, { payload: topic }: { payload: string }) => {
      delete state[topic];
    },

    removeConnections: (state, { payload: pkhs }: { payload: RawPkh[] }) =>
      fromPairs(
        Object.entries(state).filter(
          ([_, connectionInfo]) => !pkhs.includes(connectionInfo.accountPkh)
        )
      ),
  },
});

export const wcActions = wcSlice.actions;
