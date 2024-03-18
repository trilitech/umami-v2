import { createSlice } from "@reduxjs/toolkit";
import { remove } from "lodash";

import {
  AccountType,
  ImplicitAccount,
  LedgerAccount,
  MnemonicAccount,
  SecretKeyAccount,
  SocialAccount,
} from "../../../types/Account";
import { RawPkh } from "../../../types/Address";
import { EncryptedData } from "../../crypto/types";
import { changeMnemonicPassword } from "../thunks/changeMnemonicPassword";

export type State = {
  items: ImplicitAccount[];
  //TODO: Rename to encryptedMnemonics
  seedPhrases: Record<string, EncryptedData | undefined>;
  secretKeys: Record<RawPkh, EncryptedData | undefined>;
};

export const initialState: State = {
  items: [],
  seedPhrases: {},
  secretKeys: {},
};

/**
 * Stores accounts info.
 *
 * Actions related to adding or renaming accounts do not check for uniqueness of the account name.
 * In prod code use them with {@link utils/mnemonic#useGetNextAvailableAccountLabels} hook to generate unique account names.
 */
export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  extraReducers: builder => {
    builder.addCase(changeMnemonicPassword.fulfilled, (state, action) => {
      const { newEncryptedMnemonics } = action.payload;
      // Only update the mnemonic in the store if the password change was successful. The account remains unchanged.
      state.seedPhrases = newEncryptedMnemonics;
    });
  },
  reducers: {
    reset: () => initialState,
    // Do not call this directly, use useRemoveMnemonic from setAccountDataHooks
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
    // Do not call this directly, use useRemoveNonMnemonic from setAccountDataHooks
    removeNonMnemonicAccounts: (
      state,
      { payload }: { type: string; payload: { accountType: AccountType } }
    ) => {
      state.items = remove(
        state.items,
        account => account.type === "mnemonic" || account.type !== payload.accountType
      );
      if (payload.accountType === "secret_key") {
        state.secretKeys = {};
      }
    },
    // Do not call this directly, use useRemoveAccount from setAccountDataHooks
    removeAccount: (
      state,
      { payload }: { type: string; payload: SocialAccount | LedgerAccount | SecretKeyAccount }
    ) => {
      remove(state.items, account => account.address.pkh === payload.address.pkh);
      if (payload.type === "secret_key") {
        delete state.secretKeys[payload.address.pkh];
      }
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
    /**
     * For mnemonics used as a part of {@link utils/hooks/setAccountDataHooks#useDeriveMnemonicAccount} hook (for setting unique account name).
     * */
    addAccount: (state, { payload }: { payload: ImplicitAccount }) => {
      state.items = concatUnique(state.items, [payload]);
    },
    /**
     * Creates a mnemonic group.
     * Used as a part of {@link utils/hooks/setAccountDataHooks#useRestoreRevealedMnemonicAccounts} hook (for setting unique account names inside the group).
     * */
    addMnemonicAccounts: (
      state,
      {
        payload: { encryptedMnemonic, accounts, seedFingerprint },
      }: {
        type: string;
        payload: {
          seedFingerprint: string;
          encryptedMnemonic: EncryptedData;
          accounts: MnemonicAccount[];
        };
      }
    ) => {
      state.items = concatUnique(state.items, accounts);
      state.seedPhrases[seedFingerprint] = encryptedMnemonic;
    },
    // Does not add the seedphrase to the storage, only adds accounts.
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

export const accountsActions = accountsSlice.actions;
