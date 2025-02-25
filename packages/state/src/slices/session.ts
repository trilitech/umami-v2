import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    hasSession: false,
  },
  reducers: {
    setHasSession: (state, action) => {
      state.hasSession = action.payload;
    },
  },
});

export const { setHasSession } = sessionSlice.actions;
