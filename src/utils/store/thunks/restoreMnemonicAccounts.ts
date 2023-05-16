import { AnyAction, createAsyncThunk, ThunkAction } from "@reduxjs/toolkit";
import { AccountType } from "../../../types/Account";
import { makeMnemonicAccount } from "../../account/makeMnemonicAccount";
import { decrypt, encrypt } from "../../aes";
import { restoreAccount, restoreMnemonicAccounts } from "../../restoreAccounts";
import { getFingerPrint } from "../../tezos";
import accountsSlice from "../accountsSlice";
import { AppDispatch, RootState } from "../store";

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

export const deriveAccount = createAsyncThunk<
  void,
  { fingerPrint: string; password: string; label: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "accounts/deriveAccount",
  async ({ fingerPrint, password, label }, thunkAPI) => {
    const encryptedSeedphrase =
      thunkAPI.getState().accounts.seedPhrases[fingerPrint];
    if (!encryptedSeedphrase) {
      throw new Error(`No seedphrase found with fingerprint:${fingerPrint}`);
    }

    const seedphrase = await decrypt(encryptedSeedphrase, password);

    const accounts = thunkAPI
      .getState()
      .accounts.items.filter(
        (a) =>
          a.type === AccountType.MNEMONIC && a.seedFingerPrint === fingerPrint
      );

    const nextIndex = accounts.length;
    const { pk, pkh } = await restoreAccount(seedphrase, nextIndex);
    const account = makeMnemonicAccount(pk, pkh, nextIndex, fingerPrint, label);

    thunkAPI.dispatch(add(account));
  }
);
