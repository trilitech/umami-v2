import { createSlice } from "@reduxjs/toolkit";

type State = {
  number: number | null;
};

const initialState: State = {
  number: null,
};

const blockSlice = createSlice({
  name: "block",
  initialState,
  reducers: {
    reset: () => initialState,
    updateNumber: (state, { payload }: { payload: number }) => {
      state.number = payload;
    },
  },
});

export const blockActions = blockSlice.actions;

export default blockSlice;
