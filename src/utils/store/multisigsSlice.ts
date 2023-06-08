import { createSlice } from "@reduxjs/toolkit";
import { MultisigWithPendingOperations } from "../multisig/types";

type State = {
  items: MultisigWithPendingOperations[];
};

const initialState: State = { items: [] };

const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    set: (state, { payload }: { payload: MultisigWithPendingOperations[] }) => {
      state.items = payload;
    },
  },
});

export const multisigActions = multisigsSlice.actions;

export default multisigsSlice;
