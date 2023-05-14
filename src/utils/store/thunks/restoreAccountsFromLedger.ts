import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { AccountType, LedgerAccount } from "../../../types/Account";
import accountsSlice from "../accountsSlice";
import { RootState } from "../store";

const { add } = accountsSlice.actions;

export const restoreAccountsFromLdger = (
  derivationPath: string,
  pk: string,
  pkh: string,
  label?: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    const account: LedgerAccount = {
      derivationPath,
      curve: "ed25519",
      type: AccountType.LEDGER,
      pk: pk,
      pkh: pkh,
      label,
    };
    dispatch(add([account]));
  };
};
