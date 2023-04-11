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
      { contacts },
      { payload }: { payload: { addressToEdit: Address; newContact: Contact } }
    ) => {
      const { addressToEdit, newContact } = payload;
      const { name: newName, pkh: newAddress } = newContact;
      if (!contacts[addressToEdit]) {
        return;
      }
      if (
        !contacts[addressToEdit].name ||
        contacts[newAddress] ||
        (newName === contacts[addressToEdit].name &&
          newAddress === addressToEdit)
      ) {
        return;
      }
      delete contacts[addressToEdit];
      contacts[newAddress] = newContact;
    },
    remove: (state, { payload }: { payload: Address }) => {
      delete state.contacts[payload];
    },
  },
});

export const ContactsActions = contactsSlice.actions;

export default contactsSlice;
