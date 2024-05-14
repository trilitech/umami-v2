import { Action, ThunkAction } from "@reduxjs/toolkit";

import { Account } from "../../../types/Account";
import { accountsSlice } from "../slices/accountsSlice/accountsSlice";
import { multisigsSlice } from "../slices/multisigsSlice";
import { RootState } from "../store";

export const renameAccount =
  (account: Account, newName: string): ThunkAction<void, RootState, unknown, Action> =>
  (dispatch, getState) => {
    const { accounts, multisigs, contacts } = getState();

    const isMultisig = account.type === "multisig";

    const accountNames = accounts.items.map(account => account.label);
    const multisigNames = multisigs.items.map(multisig => multisig.label);
    const contactNames = Object.values(contacts).map(contact => contact.name);

    if ([accountNames, multisigNames, contactNames].flat().includes(newName)) {
      return;
    }

    if (isMultisig) {
      dispatch(multisigsSlice.actions.setName({ newName, account }));
    } else {
      dispatch(accountsSlice.actions.renameAccount({ newName, account }));
    }
  };
