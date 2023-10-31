import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Account, AccountType } from "../../../types/Account";
import multisigsSlice from "../slices/multisigsSlice";
import accountsSlice from "../slices/accountsSlice";

const renameAccount = (
  account: Account,
  newName: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
    const { accounts, multisigs } = getState();

    const isMultisig = account.type === AccountType.MULTISIG;
    const pkhs = isMultisig
      ? [...multisigs.items.map(multisig => multisig.address.pkh)]
      : [...accounts.items.map(account => account.address.pkh)];
    const names = isMultisig
      ? [...multisigs.items.map(multisig => multisig.label)]
      : [...accounts.items.map(account => account.label)];

    if (!pkhs.includes(account.address.pkh) || names.includes(newName)) {
      return;
    }

    if (isMultisig) {
      dispatch(multisigsSlice.actions.setName({ newName, account }));
    } else {
      dispatch(accountsSlice.actions.renameAccount({ newName, account }));
    }
  };
};

export default renameAccount;
