import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Account } from "../../../types/Account";
import { multisigsSlice } from "../slices/multisigsSlice";
import { accountsSlice } from "../slices/accountsSlice";

export const renameAccount = (
  account: Account,
  newName: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
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
};
