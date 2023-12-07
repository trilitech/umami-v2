import { createSlice } from "@reduxjs/toolkit";

import { RawPkh } from "../../../types/Address";

type State = Record<string, RawPkh>;

const initialState: State = {};

export const beaconSlice = createSlice({
  name: "beacon",
  initialState,
  reducers: {
    reset: () => initialState,

    addConnection: (state, { payload }: { payload: { dAppId: string; accountPkh: RawPkh } }) => {
      state[payload.dAppId] = payload.accountPkh;
    },

    removeConnection: (state, { payload }: { payload: { dAppId: string } }) => {
      delete state[payload.dAppId];
    },
  },
});

export const beaconActions = beaconSlice.actions;
