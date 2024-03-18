import { Action, ThunkAction } from "@reduxjs/toolkit";

import { Contact } from "../../../types/Contact";
import { contactsActions } from "../slices/contactsSlice";
import { RootState } from "../store";

const { upsert } = contactsActions;

export const checkAccountsAndUpsertContact =
  (contact: Contact): ThunkAction<void, RootState, unknown, Action> =>
  (dispatch, getState) => {
    const { accounts } = getState();
    const existingAccount = accounts.items.find(
      account => account.address.pkh === contact.pkh || account.label === contact.name
    );

    if (existingAccount) {
      return;
    }

    dispatch(upsert(contact));
  };
