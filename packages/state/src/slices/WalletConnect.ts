import { createSlice } from "@reduxjs/toolkit";

export type WalletConnectInfo = {
  peerListUpdatedToggle: boolean;
};

// mapping topic -> connection info
export type State = WalletConnectInfo;

export const wcInitialState: State = { peerListUpdatedToggle: false };

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

    togglePeerListUpdated: state => {
      state.peerListUpdatedToggle = !state.peerListUpdatedToggle;
    },
  },
});

export const wcActions = wcSlice.actions;
