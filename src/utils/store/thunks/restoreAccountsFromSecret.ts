import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { encrypt } from "../../aes";
import { restoreMnemonicAccounts } from "../../restoreAccounts";
import { getFingerPrint } from "../../tezos";
import accountsSlice from "../accountsSlice";
import { RootState } from "../store";

const { addSecret, add } = accountsSlice.actions;

export const restoreAccountsFromSecret = (
  seedPhrase: string,
  password: string,
  label?: string,
  derivationPath?: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    const seedFingerPrint = await getFingerPrint(seedPhrase);
    const accounts = await restoreMnemonicAccounts(
      seedPhrase,
      label,
      derivationPath
    );
    dispatch(
      addSecret({
        hash: seedFingerPrint,
        secret: await encrypt(seedPhrase, password),
      })
    );
    dispatch(add(accounts));
  };
};
