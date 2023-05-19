import { createSlice } from "@reduxjs/toolkit";
import { Contact } from "../../types/Contact";
import { nameExistsInContacts } from "../hooks/contactsUtils";

type State = Record<string, Contact>;

const initialState: State = {};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    reset: () => initialState,
    // Don't use this action directly. Use thunk checkAccountsAndUpsertContact
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

export default contactsSlice;
