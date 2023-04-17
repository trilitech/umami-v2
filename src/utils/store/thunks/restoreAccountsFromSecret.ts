import { TezosNetwork } from "@airgap/tezos";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { TransactionValues } from "../../../components/sendForm/types";
import { encrypt } from "../../aes";
import { restoreEncryptedAccounts } from "../../restoreAccounts";
import { getFingerPrint } from "../../tezos";
import accountsSlice from "../accountsSlice";
import { RootState } from "../store";

const { addSecret, add } = accountsSlice.actions;

export const restoreAccountsFromSecret = (
  seedPhrase: string,
  password: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    const seedFingerPrint = await getFingerPrint(seedPhrase);
    const accounts = await restoreEncryptedAccounts(seedPhrase, password);
    dispatch(
      addSecret({
        hash: seedFingerPrint,
        secret: await encrypt(seedPhrase, password),
      })
    );
    dispatch(add(accounts));
  };
};
