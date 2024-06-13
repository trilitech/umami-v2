import { createSlice } from "@reduxjs/toolkit";

import { type ErrorContext } from "../../getErrorContext";

type State = ErrorContext[];

const MAX_ERRORS_LEN = 100;

export const initialState: State = [];

export const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    reset: () => initialState,

    add(state, { payload }: { payload: ErrorContext }) {
      if (state.length === MAX_ERRORS_LEN) {
        state.shift();
      }
      state.push(payload);
    },
  },
});
