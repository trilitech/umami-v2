import { createAsyncThunk } from "@reduxjs/toolkit";
import { AccountType, MnemonicAccount } from "../../../types/Account";
import { makeDerivationPath } from "../../account/derivationPathUtils";
import { makeMnemonicAccount } from "../../account/makeMnemonicAccount";
import { EncryptedData } from "../../crypto/types";
import { getFingerPrint } from "../../tezos";
import { ExtraArgument } from "../extraArgument";
import { AppDispatch, RootState } from "../store";

export const restoreFromMnemonic = createAsyncThunk<
  {
    seedFingerprint: string;
    encryptedMnemonic: EncryptedData;
    accounts: MnemonicAccount[];
  },
  {
    mnemonic: string;
    password: string;
    label?: string;
    derivationPathPattern?: string;
  },
  { dispatch: AppDispatch; state: RootState; extra: ExtraArgument }
>(
  "accounts/restoreFromMnemonic",
  async ({ mnemonic, password, label, derivationPathPattern }, thunkAPI) => {
    return {
      seedFingerprint: await getFingerPrint(mnemonic),
      accounts: await thunkAPI.extra.restoreRevealedMnemonicAccounts(
        mnemonic,
        thunkAPI.getState().networks.current,
        label,
        derivationPathPattern
      ),
      encryptedMnemonic: await thunkAPI.extra.encrypt(mnemonic, password),
    };
  }
);

export const deriveAccount = createAsyncThunk<
  MnemonicAccount,
  { fingerPrint: string; password: string; label: string },
  { dispatch: AppDispatch; state: RootState; extra: ExtraArgument }
>("accounts/deriveAccount", async ({ fingerPrint, password, label }, thunkAPI) => {
  const encryptedSeedphrase = thunkAPI.getState().accounts.seedPhrases[fingerPrint];
  if (!encryptedSeedphrase) {
    throw new Error(`No seedphrase found with fingerprint:${fingerPrint}`);
  }

  const seedphrase = await thunkAPI.extra.decrypt(encryptedSeedphrase, password);

  const accounts = thunkAPI
    .getState()
    .accounts.items.filter(
      a => a.type === AccountType.MNEMONIC && a.seedFingerPrint === fingerPrint
    ) as MnemonicAccount[];

  const nextIndex = accounts.length;

  // Newly derived accounts use a derivation path in the same pattern as the first account
  const pattern = accounts[0].derivationPathPattern;
  const nextDerivationPath = makeDerivationPath(pattern, nextIndex);

  const { pk, pkh } = await thunkAPI.extra.derivePublicKeyPair(seedphrase, nextDerivationPath);

  const account = makeMnemonicAccount(pk, pkh, nextDerivationPath, pattern, fingerPrint, label);

  return account;
});
