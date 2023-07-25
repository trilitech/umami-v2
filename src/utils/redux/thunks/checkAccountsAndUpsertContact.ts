import { Contact } from "../../../types/Contact";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { contactsActions } from "../slices/contactsSlice";

const { upsert } = contactsActions;

const checkAccountsAndUpsertContact = (
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

export default checkAccountsAndUpsertContact;
