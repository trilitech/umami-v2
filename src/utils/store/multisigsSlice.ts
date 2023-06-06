import { createSlice } from "@reduxjs/toolkit";
import { AccountToMultisigs } from "../multisig/types";

type State = AccountToMultisigs;

const initialState: State = {};

const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    set: (_, { payload }: { payload: AccountToMultisigs }) => payload,
  },
});

export const multisigActions = multisigsSlice.actions;

export default multisigsSlice;
