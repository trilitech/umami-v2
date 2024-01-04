import { createAsyncThunk } from "@reduxjs/toolkit";
import { fromPairs } from "lodash";

import { decrypt, encrypt } from "../../crypto/AES";
import { EncryptedData } from "../../crypto/types";
import { AppDispatch, RootState } from "../store";

export const changeMnemonicPassword = createAsyncThunk<
  {
    newEncryptedMnemonics: Record<string, EncryptedData | undefined>;
  },
  {
    currentPassword: string;
    newPassword: string;
  },
  { dispatch: AppDispatch; state: RootState }
>("accounts/changeMnemonicPassword", async ({ currentPassword, newPassword }, { getState }) => {
  if (currentPassword === newPassword) {
    throw new Error("New password must be different from the current password");
  }

  const { items: accounts, seedPhrases } = getState().accounts;

  if (accounts.filter(account => account.type === "mnemonic").length === 0) {
    throw new Error("No mnemonic accounts found");
  }

  const newEncryptedMnemonics = await Promise.all(
    Object.entries(seedPhrases).map(async ([fingerprint, currentEncryptedMnemonic]) => {
      if (!currentEncryptedMnemonic) {
        throw new Error("No encrypted mnemonic found");
      }
      try {
        // Re-encrypt mnemonic with new password
        const mnemonic = await decrypt(currentEncryptedMnemonic, currentPassword);
        const newEncryptedMnemonic = await encrypt(mnemonic, newPassword);

        return [fingerprint, newEncryptedMnemonic];
      } catch (err: any) {
        throw new Error(err.message);
      }
    })
  );

  return { newEncryptedMnemonics: fromPairs(newEncryptedMnemonics) };
});
