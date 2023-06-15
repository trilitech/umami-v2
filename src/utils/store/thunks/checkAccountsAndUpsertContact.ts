import { Contact } from "../../../types/Contact";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { contactsActions } from "../contactsSlice";
import { RootState } from "../store";

const { upsert } = contactsActions;

const checkAccountsAndUpsertContact = (
  contact: Contact
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
    const { accounts } = getState();
    const existingAccount = accounts.items.find(account => {
      return account.pkh === contact.pkh || account.label === contact.name;
    });

    if (existingAccount) {
      return;
    }

    dispatch(upsert(contact));
  };
};

export default checkAccountsAndUpsertContact;
