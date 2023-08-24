import { createAsyncThunk } from "@reduxjs/toolkit";
import { fromPairs } from "lodash";
import { AccountType } from "../../../types/Account";
import { EncryptedData } from "../../crypto/types";
import { ExtraArgument } from "../extraArgument";
import { AppDispatch, RootState } from "../store";

const changeMnemonicPassword = createAsyncThunk<
  {
    newEncryptedMnemonics: Record<string, EncryptedData | undefined>;
  },
  {
    currentPassword: string;
    newPassword: string;
  },
  { dispatch: AppDispatch; state: RootState; extra: ExtraArgument }
>(
  "accounts/changeMnemonicPassword",
  async ({ currentPassword, newPassword }, { getState, extra }) => {
    if (currentPassword === newPassword) {
      throw new Error("New password must be different from the current password");
    }

    const { items: accounts, mnemonics } = getState().accounts;

    if (accounts.filter(account => account.type === AccountType.MNEMONIC).length === 0) {
      throw new Error("No mnemonic accounts found");
    }

    const newEncryptedMnemonics = await Promise.all(
      Object.entries(mnemonics).map(async ([fingerprint, currentEncryptedMnemonic]) => {
        if (!currentEncryptedMnemonic) {
          throw new Error("No encrypted mnemonic found");
        }
        try {
          // Re-encrypt mnemonic with new password
          const mnemonic = await extra.decrypt(currentEncryptedMnemonic, currentPassword);
          const newEncryptedMnemonic = await extra.encrypt(mnemonic, newPassword);

          return [fingerprint, newEncryptedMnemonic];
        } catch (err: any) {
          throw new Error(err.message);
        }
      })
    );

    return { newEncryptedMnemonics: fromPairs(newEncryptedMnemonics) };
  }
);

export default changeMnemonicPassword;
