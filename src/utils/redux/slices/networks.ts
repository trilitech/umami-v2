import { createSlice } from "@reduxjs/toolkit";
import { remove } from "lodash";

import { DefaultNetworks, MAINNET, Network, isDefault } from "../../../types/Network";

type State = {
  available: Network[];
  current: Network;
};

const initialState: State = {
  available: DefaultNetworks,
  current: MAINNET,
};

export const networksSlice = createSlice({
  name: "networks",
  initialState,
  reducers: {
    reset: () => initialState,
    setCurrent: (state, { payload: network }: { payload: Network }) => {
      state.current = network;
    },
    upsertNetwork: (state, { payload: network }: { payload: Network }) => {
      if (isDefault(network)) {
        return;
      }
      const index = state.available.findIndex(n => n.name === network.name);
      // If the current network is the one we're updating, update it too
      // otherwise, it's going to be changed only
      // when we switch to another one and back to the current one
      if (state.current.name === network.name) {
        state.current = network;
      }

      if (index !== -1) {
        state.available[index] = network;
        return;
      }
      state.available.push(network);
    },
    removeNetwork: (state, { payload: network }: { payload: Network }) => {
      if (isDefault(network)) {
        return;
      }
      remove(state.available, n => n.name === network.name);
    },
  },
});
export const networksActions = networksSlice.actions;
