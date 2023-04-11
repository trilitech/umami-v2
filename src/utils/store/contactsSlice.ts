import { createSlice } from "@reduxjs/toolkit";
import { Contact } from "../../types/AddressBook";

type State = {
  contacts: Record<Address, Contact>;
};

type Address = Contact["pkh"];

const initialState: State = {
  contacts: {},
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    reset: () => initialState,
    upsert: ({ contacts }, { payload }: { payload: Contact }) => {
      contacts[payload.pkh] = payload;
    },
    remove: (state, { payload }: { payload: Address }) => {
      delete state.contacts[payload];
    },
  },
});

export const ContactsActions = contactsSlice.actions;

export default contactsSlice;
