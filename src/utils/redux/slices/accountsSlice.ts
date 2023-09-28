import { createSlice } from "@reduxjs/toolkit";
import { AccountType, ImplicitAccount } from "../../../types/Account";
import { EncryptedData } from "../../crypto/types";
import changeMnemonicPassword from "../thunks/changeMnemonicPassword";
import { deriveAccount, restoreFromMnemonic } from "../thunks/restoreMnemonicAccounts";
import { remove } from "lodash";

export type State = {
  items: ImplicitAccount[];
  //TODO: Rename to encryptedMnemonics
  seedPhrases: Record<string, EncryptedData | undefined>;
};

const initialState: State = {
  items: [],
  seedPhrases: {},
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  extraReducers: builder => {
    builder.addCase(deriveAccount.fulfilled, (state, action) => {
      state.items = concatUnique(state.items, [action.payload]);
    });

    builder.addCase(restoreFromMnemonic.fulfilled, (state, action) => {
      const { accounts, encryptedMnemonic, seedFingerprint } = action.payload;
      state.items = concatUnique(state.items, accounts);
      // updated seedphrase after a successfull restoration.
      state.seedPhrases[seedFingerprint] = encryptedMnemonic;
    });

    builder.addCase(changeMnemonicPassword.fulfilled, (state, action) => {
      const { newEncryptedMnemonics } = action.payload;
      // Only update the mnemonic in the store if the password change was successful. The account remains unchanged.
      state.seedPhrases = newEncryptedMnemonics;
    });
  },
  reducers: {
    reset: () => initialState,
    removeMnemonicAndAccounts: (
      state,
      { payload }: { type: string; payload: { fingerPrint: string } }
    ) => {
      const { fingerPrint } = payload;
      const newAccounts = state.items.filter(
        a => !(a.type === AccountType.MNEMONIC && a.seedFingerPrint === fingerPrint)
      );
      state.items = newAccounts;
      delete state.seedPhrases[fingerPrint];
    },
    removeNonMnemonicAccounts: (
      state,
      { payload }: { type: string; payload: { accountType: AccountType } }
    ) => {
      state.items = remove(state.items, account => {
        return account.type === AccountType.MNEMONIC || account.type !== payload.accountType;
      });
    },
    addAccount: (state, { payload }: { type: string; payload: ImplicitAccount[] }) => {
      state.items = concatUnique(state.items, payload);
    },
  },
});

const concatUnique = (existingAccounts: ImplicitAccount[], newAccounts: ImplicitAccount[]) => {
  newAccounts.forEach(newAccount => {
    if (
      existingAccounts.some(
        existingAccount => existingAccount.address.pkh === newAccount.address.pkh
      )
    ) {
      throw new Error(
        `Can't add account ${newAccount.address.pkh} in store since it already exists.`
      );
    }
  });

  return [...existingAccounts, ...newAccounts];
};

export default accountsSlice;
