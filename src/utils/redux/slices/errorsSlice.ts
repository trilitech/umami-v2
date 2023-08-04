import { createSlice } from "@reduxjs/toolkit";
import { ErrorContext } from "../../getErrorContext";

type State = ErrorContext[];

const MAX_ERRORS_LEN = 100;

const initialState: State = [];

const errorsSlice = createSlice({
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

export default errorsSlice;
