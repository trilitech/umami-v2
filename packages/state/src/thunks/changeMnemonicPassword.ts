import { createAsyncThunk } from "@reduxjs/toolkit";
import { type EncryptedData, decrypt, encrypt } from "@umami/crypto";
import { CustomError } from "@umami/utils";
import { fromPairs } from "lodash";

import { type AccountsState } from "../slices/accounts/State";

export const changeMnemonicPassword = createAsyncThunk<
  {
    newEncryptedMnemonics: Record<string, EncryptedData | undefined>;
  },
  {
    currentPassword: string;
    newPassword: string;
  },
  { state: { accounts: AccountsState } }
>("accounts/changeMnemonicPassword", async ({ currentPassword, newPassword }, { getState }) => {
  if (currentPassword === newPassword) {
    throw new CustomError("New password must be different from the current password");
  }

  const { items: accounts, seedPhrases } = getState().accounts;

  if (accounts.filter(account => account.type === "mnemonic").length === 0) {
    throw new CustomError("No mnemonic accounts found");
  }

  const newEncryptedMnemonics = await Promise.all(
    Object.entries(seedPhrases).map(async ([fingerprint, currentEncryptedMnemonic]) => {
      if (!currentEncryptedMnemonic) {
        throw new CustomError("No encrypted mnemonic found");
      }
      try {
        // Re-encrypt mnemonic with new password
        const mnemonic = await decrypt(currentEncryptedMnemonic, currentPassword);
        const newEncryptedMnemonic = await encrypt(mnemonic, newPassword);

        return [fingerprint, newEncryptedMnemonic];
      } catch (err: any) {
        throw new CustomError(err.message);
      }
    })
  );

  return { newEncryptedMnemonics: fromPairs(newEncryptedMnemonics) };
});
