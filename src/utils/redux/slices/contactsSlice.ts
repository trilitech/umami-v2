import { createSlice } from "@reduxjs/toolkit";

import { Contact } from "../../../types/Contact";
import { nameExistsInContacts } from "../../hooks/contactsUtils";

type State = Record<string, Contact>;

export const initialState: State = {};

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    reset: () => initialState,
    // Make sure to check that pkh is not used in accounts & the name is unique.
    upsert: (state, { payload }: { payload: Contact }) => {
      if (nameExistsInContacts(state, payload.name)) {
        return;
      }
      state[payload.pkh] = payload;
    },
    remove: (state, { payload }: { payload: string }) => {
      delete state[payload];
    },
  },
});

export const contactsActions = contactsSlice.actions;
