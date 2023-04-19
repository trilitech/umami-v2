import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { encrypt } from "../../aes";
import { restoreMnemonicAccounts } from "../../restoreAccounts";
import accountsSlice from "../accountsSlice";
import { RootState } from "../store";
import { getFingerPrint } from "../../tezos/helpers";

const { addSecret, add } = accountsSlice.actions;

export const restoreAccountsFromSecret = (
  seedPhrase: string,
  password: string,
  label?: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    const seedFingerPrint = await getFingerPrint(seedPhrase);
    const accounts = await restoreMnemonicAccounts(seedPhrase, label);
    dispatch(
      addSecret({
        hash: seedFingerPrint,
        secret: await encrypt(seedPhrase, password),
      })
    );
    dispatch(add(accounts));
  };
};
