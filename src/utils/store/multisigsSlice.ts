import { createSlice } from "@reduxjs/toolkit";
import { MultisigLookups } from "../multisig/types";

type State = MultisigLookups;

const initialState: State = {
  accountToMultisigsWithPendings: {},
  multiSigToSigners: {},
};

const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    set: (state, { payload }: { payload: MultisigLookups }) => {
      state.accountToMultisigsWithPendings = {
        ...payload.accountToMultisigsWithPendings,
      };
      state.multiSigToSigners = { ...payload.multiSigToSigners };
    },
  },
});

export const multisigActions = multisigsSlice.actions;

export default multisigsSlice;
