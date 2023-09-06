import { createSlice } from "@reduxjs/toolkit";
import { DefaultNetworks, MAINNET, Network } from "../../../types/Network";

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
    setCurrent: (state, { payload }: { payload: Network }) => {
      state.current = payload;
    },
  },
});
export const networksActions = networksSlice.actions;
