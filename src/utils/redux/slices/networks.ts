import { createSlice } from "@reduxjs/toolkit";
import { DefaultNetworks, MAINNET, Network } from "../../../types/Network";
import { remove } from "lodash";

type State = {
  available: Network[];
  current: Network;
};

const initialState: State = {
  available: DefaultNetworks,
  current: MAINNET,
};

const isDefault = (network: Network) => DefaultNetworks.map(n => n.name).includes(network.name)

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
      state.available = remove(state.available, n => n.name !== network.name);
    }
  },
});
export const networksActions = networksSlice.actions;
