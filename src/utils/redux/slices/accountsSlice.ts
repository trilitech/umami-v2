import { createSlice } from "@reduxjs/toolkit";
import {
  AccountType,
  ImplicitAccount,
  LedgerAccount,
  MnemonicAccount,
  SecretKeyAccount,
  SocialAccount,
} from "../../../types/Account";
import { EncryptedData } from "../../crypto/types";
import { changeMnemonicPassword } from "../thunks/changeMnemonicPassword";
import { deriveAccount, restoreFromMnemonic } from "../thunks/restoreMnemonicAccounts";
import { remove } from "lodash";
import { RawPkh } from "../../../types/Address";

export type State = {
  items: ImplicitAccount[];
  //TODO: Rename to encryptedMnemonics
  seedPhrases: Record<string, EncryptedData | undefined>;
  secretKeys: Record<RawPkh, EncryptedData | undefined>;
};

const initialState: State = {
  items: [],
  seedPhrases: {},
  secretKeys: {},
};

export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  extraReducers: builder => {
    builder.addCase(deriveAccount.fulfilled, (state, action) => {
      state.items = concatUnique(state.items, [action.payload]);
    });

    builder.addCase(restoreFromMnemonic.fulfilled, (state, action) => {
      const { accounts, encryptedMnemonic, seedFingerprint } = action.payload;
      state.items = concatUnique(state.items, accounts);
      // updated seedphrase after a successful restoration.
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
        a => !(a.type === "mnemonic" && a.seedFingerPrint === fingerPrint)
      );
      state.items = newAccounts;
      delete state.seedPhrases[fingerPrint];
    },
    removeNonMnemonicAccounts: (
      state,
      { payload }: { type: string; payload: { accountType: AccountType } }
    ) => {
      state.items = remove(state.items, account => {
        return account.type === "mnemonic" || account.type !== payload.accountType;
      });
    },
    removeAccount: (
      state,
      { payload }: { type: string; payload: SocialAccount | LedgerAccount | SecretKeyAccount }
    ) => {
      remove(state.items, account => {
        return account.address.pkh === payload.address.pkh;
      });
    },
    // Do not call this directly, use the RenameAccount thunk
    renameAccount: (
      state,
      { payload }: { type: string; payload: { account: ImplicitAccount; newName: string } }
    ) => {
      const { account, newName } = payload;
      if (newName.length === 0) {
        throw new Error("Cannot rename account to an empty name.");
      }
      if (state.items.find(a => a.label === newName)) {
        throw new Error(
          `Cannot rename account ${account.address.pkh} to ${newName} since the name already exists.`
        );
      }
      const accountToRename = state.items.find(
        a => a.address.pkh === account.address.pkh && a.label === account.label
      );
      if (accountToRename) {
        accountToRename.label = newName;
      }
    },
    // To add mnemonic accounts, use the `restoreFromMnemonic` and `deriveAccount` thunk.
    addAccount: (
      state,
      { payload }: { payload: SocialAccount | LedgerAccount | SecretKeyAccount }
    ) => {
      state.items = concatUnique(state.items, [payload]);
    },
    // Use only for testing purpose
    addMockMnemonicAccounts: (state, { payload }: { type: string; payload: MnemonicAccount[] }) => {
      state.items = concatUnique(state.items, payload);
    },
    addSecretKey: (
      state,
      {
        payload: { pkh, encryptedSecretKey },
      }: { payload: { encryptedSecretKey: EncryptedData; pkh: RawPkh } }
    ) => {
      state.secretKeys[pkh] = encryptedSecretKey;
    },
    removeSecretKey: (state, { payload: account }: { payload: SecretKeyAccount }) => {
      delete state.secretKeys[account.address.pkh];
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
