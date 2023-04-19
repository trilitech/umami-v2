import { createSlice } from "@reduxjs/toolkit";
import { Contact } from "../../types/Contact";

type State = Record<string, Contact>;

const initialState: State = {};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    reset: () => initialState,
    upsert: (state, { payload }: { payload: Contact }) => {
      const contacts: Contact[] = Object.values(state);
      if (contacts.find((c) => c.name === payload.name)) {
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
