import { createSlice } from "@reduxjs/toolkit";
import { type ErrorContext } from "@umami/core";

type State = ErrorContext[];

const MAX_ERRORS_LEN = 100;

export const errorsInitialState: State = [];

export const errorsSlice = createSlice({
  name: "errors",
  initialState: errorsInitialState,
  reducers: {
    reset: () => errorsInitialState,

    add(state, { payload }: { payload: ErrorContext }) {
      if (state.length === MAX_ERRORS_LEN) {
        state.shift();
      }
      state.push(payload);
    },
  },
});
