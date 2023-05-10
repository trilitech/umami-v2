import { createSlice } from "@reduxjs/toolkit";
import { MultisigLookups } from "../multisig/types";

type State = MultisigLookups;

const initialState: State = {
  accountToMultisigs: {},
  multiSigToSigners: {},
};

const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    set: (state, { payload }: { payload: MultisigLookups }) => {
      state = { ...payload };
    },
  },
});

export const multisigActions = multisigsSlice.actions;

export default multisigsSlice;
