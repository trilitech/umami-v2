import { createSlice } from "@reduxjs/toolkit";

import { StoredContactInfo } from "../../../types/Contact";

type State = Record<string, StoredContactInfo>;

export const initialState: State = {};

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    reset: () => initialState,
    // Make sure to check that
    // - pkh is not used in accounts and other contacts
    // - the name is unique across all accounts and contacts
    upsert: (state, { payload }: { payload: StoredContactInfo }) => {
      state[payload.pkh] = payload;
    },
    remove: (state, { payload }: { payload: string }) => {
      delete state[payload];
    },
  },
});

export const contactsActions = contactsSlice.actions;
