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
    add: (state, { payload }: { payload: Contact }) => {
      if (state.contacts[payload.pkh]) {
        return;
      }
      state.contacts[payload["pkh"]] = payload;
    },
    edit: (
      state,
      { payload }: { payload: { oldAddress: Address; newContact: Contact } }
    ) => {
      const { oldAddress, newContact } = payload;
      const { name: newName, pkh: newAddress } = newContact;
      if (!state.contacts[oldAddress]) {
        return;
      }
      if (
        !state.contacts[oldAddress].name ||
        state.contacts[newAddress] ||
        (newName === state.contacts[oldAddress].name &&
          newAddress === oldAddress)
      ) {
        return;
      }
      delete state.contacts[oldAddress];
      state.contacts[newAddress] = newContact;
    },
    remove: (state, { payload }: { payload: Address }) => {
      delete state.contacts[payload];
    },
  },
});

export const ContactsActions = contactsSlice.actions;

export default contactsSlice;
