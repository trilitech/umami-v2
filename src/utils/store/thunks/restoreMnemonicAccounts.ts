import { createAsyncThunk } from "@reduxjs/toolkit";
import { AccountType, MnemonicAccount } from "../../../types/Account";
import { UmamiEncrypted } from "../../../types/UmamiEncrypted";
import { makeMnemonicAccount } from "../../account/makeMnemonicAccount";
import { decrypt, encrypt } from "../../aes";
import { restoreAccount, restoreMnemonicAccounts } from "../../restoreAccounts";
import { getFingerPrint } from "../../tezos";
import { AppDispatch, RootState } from "../store";

export const restoreFromMnemonic = createAsyncThunk<
  {
    seedFingerprint: string;
    encryptedMnemonic: UmamiEncrypted;
    accounts: MnemonicAccount[];
  },
  {
    seedPhrase: string;
    password: string;
    label?: string;
  },
  { dispatch: AppDispatch; state: RootState }
>("accounts/restoreFromMnemonic", async ({ seedPhrase, password, label }) => {
  return {
    seedFingerprint: await getFingerPrint(seedPhrase),
    accounts: await restoreMnemonicAccounts(seedPhrase, label),
    encryptedMnemonic: await encrypt(seedPhrase, password),
  };
});

export const deriveAccount = createAsyncThunk<
  MnemonicAccount,
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

    return account;
  }
);
