import { createSlice } from "@reduxjs/toolkit";
import { MultisigWithOperations } from "../multisig/types";

type State = {
  items: MultisigWithOperations[];
};

const initialState: State = { items: [] };

const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    set: (state, { payload }: { payload: MultisigWithOperations[] }) => {
      state.items = payload;
    },
  },
});

export const multisigActions = multisigsSlice.actions;

export default multisigsSlice;
