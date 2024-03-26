import { createSlice } from "@reduxjs/toolkit";

import { StoredContactInfo } from "../../../types/Contact";
import { setNetworksForContacts } from "../thunks/contactNetwork";

type State = Record<string, StoredContactInfo>;

export const initialState: State = {};

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  extraReducers: builder => {
    builder.addCase(setNetworksForContacts.fulfilled, (state, action) => {
      const { updatedContacts } = action.payload;
      state = updatedContacts;
    });
  },
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
