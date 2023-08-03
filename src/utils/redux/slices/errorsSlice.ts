import { createSlice } from "@reduxjs/toolkit";

type ErrorInfo = {
  timestamp: string;
  description: string;
  stacktrace: string;
};

type State = ErrorInfo[];

const MAX_ERRORS_LEN = 100;

const initialState: State = [];

const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    reset: () => initialState,

    add(state, { payload }: { payload: ErrorInfo }) {
      if (state.length === MAX_ERRORS_LEN) {
        state.shift();
      }
      state.push(payload);
    },
  },
});

export default errorsSlice;
