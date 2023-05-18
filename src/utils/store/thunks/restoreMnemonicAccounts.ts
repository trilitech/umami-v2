import { createAsyncThunk } from "@reduxjs/toolkit";
import { AccountType, MnemonicAccount } from "../../../types/Account";
import { UmamiEncrypted } from "../../../types/UmamiEncrypted";
import {
  deductDerivationPattern,
  makeDerivationPath,
} from "../../account/derivationPathUtils";
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
    derivationPathPattern?: string;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  "accounts/restoreFromMnemonic",
  async ({ seedPhrase, password, label, derivationPathPattern }) => {
    return {
      seedFingerprint: await getFingerPrint(seedPhrase),
      accounts: await restoreMnemonicAccounts(
        seedPhrase,
        label,
        derivationPathPattern
      ),
      encryptedMnemonic: await encrypt(seedPhrase, password),
    };
  }
);

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
      ) as MnemonicAccount[];

    const nextIndex = accounts.length;

    // Newly derived accounts use a derivation path in the same pattern as the first account
    const pattern = deductDerivationPattern(accounts[0].derivationPath);
    const nextDerivationPath = makeDerivationPath(pattern, nextIndex);
    const { pk, pkh } = await restoreAccount(seedphrase, nextDerivationPath);

    const account = makeMnemonicAccount(
      pk,
      pkh,
      nextDerivationPath,
      fingerPrint,
      label
    );

    return account;
  }
);
