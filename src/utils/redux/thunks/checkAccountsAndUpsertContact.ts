import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { Contact } from "../../../types/Contact";
import { contactsActions } from "../slices/contactsSlice";
import { RootState } from "../store";

const { upsert } = contactsActions;

export const checkAccountsAndUpsertContact = (
  contact: Contact
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
    const { accounts } = getState();
    const existingAccount = accounts.items.find(account => {
      return account.address.pkh === contact.pkh || account.label === contact.name;
    });

    if (existingAccount) {
      return;
    }

    dispatch(upsert(contact));
  };
};