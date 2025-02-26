import { createSlice } from "@reduxjs/toolkit";
import {
  type AccountType,
  type ImplicitAccount,
  type LedgerAccount,
  type MnemonicAccount,
  type SecretKeyAccount,
  type SocialAccount,
} from "@umami/core";
import { type EncryptedData } from "@umami/crypto";
import { type RawPkh } from "@umami/tezos";
import { CustomError } from "@umami/utils";
import { remove } from "lodash";

import { type AccountsState } from "./State";
import { changeMnemonicPassword } from "../../thunks/changeMnemonicPassword";

export const accountsInitialState: AccountsState = {
  items: [],
  seedPhrases: {},
  secretKeys: {},
  password: "",
  alerts: {
    isSocialLoginWarningShown: false,
    isExtensionsWarningShown: false,
  },
};

/**
 * Stores accounts info.
 *
 * Actions related to adding or renaming accounts do not check for uniqueness of the account name.
 * In prod code use them with {@link utils/mnemonic#useGetNextAvailableAccountLabels} hook to generate unique account names.
 */
export const accountsSlice = createSlice({
  name: "accounts",
  initialState: accountsInitialState,
  extraReducers: builder => {
    builder.addCase(changeMnemonicPassword.fulfilled, (state, action) => {
      const { newEncryptedMnemonics } = action.payload;
      // Only update the mnemonic in the store if the password change was successful. The account remains unchanged.
      state.seedPhrases = newEncryptedMnemonics;
    });
  },
  reducers: {
    reset: () => accountsInitialState,
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
        throw new CustomError("Cannot rename account to an empty name.");
      }
      if (state.items.find(a => a.label === newName)) {
        throw new CustomError(
          `Cannot rename account ${account.address.pkh} to ${newName} since the name already exists.`
        );
      }
      const accountToRename = state.items.find(
        a => a.address.pkh === account.address.pkh && a.label === account.label
      );
      if (accountToRename) {
        accountToRename.label = newName;
        if (state.defaultAccount?.address.pkh === accountToRename.address.pkh) {
          state.defaultAccount.label = newName;
        }
      }
    },
    /**
     * For mnemonics used as a part of {@link ./hooks/mnemonic#useDeriveMnemonicAccount} hook (for setting unique account name).
     * */
    addAccount: (state, { payload }: { payload: ImplicitAccount }) => {
      state.items = concatUnique(state.items, [payload]);
    },
    /**
     * Creates a mnemonic group.
     * Used as a part of {@link ./hooks/mnemonic#useRestoreRevealedMnemonicAccounts} hook (for setting unique account names inside the group).
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
    addSecretKey: (
      state,
      {
        payload: { pkh, encryptedSecretKey },
      }: { payload: { encryptedSecretKey: EncryptedData; pkh: RawPkh } }
    ) => {
      state.secretKeys[pkh] = encryptedSecretKey;
    },
    setCurrent: (state, { payload: address }: { payload: RawPkh | undefined }) => {
      state.current = address;
    },
    setDefaultAccount: state => {
      if (!state.defaultAccount) {
        state.defaultAccount = hideConfidentialData(state.items[0]);
      }
    },
    setIsVerified: (
      state,
      { payload: { pkh, isVerified } }: { payload: { pkh: RawPkh; isVerified: boolean } }
    ) => {
      const account = state.items.find(account => account.address.pkh === pkh) as MnemonicAccount;

      account.isVerified = isVerified;
    },
    setPassword: (state, { payload }: { payload: string }) => {
      state.password = payload;
    },
    setAlerts: (
      state,
      { payload }: { payload: { key: keyof AccountsState["alerts"]; value: boolean } }
    ) => {
      state.alerts = {
        ...state.alerts,
        [payload.key]: payload.value,
      };
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
      throw new CustomError(
        `Can't add account with address ${newAccount.address.pkh} because it already exists.`
      );
    }
  });

  return [...existingAccounts, ...newAccounts];
};

function hideConfidentialData(acct: ImplicitAccount): ImplicitAccount {
  const account = { ...acct } as ImplicitAccount;
  if (account.type === "social") {
    if (account.label.includes("@")) {
      account.label =
        account.label.slice(0, 2) + "..." + account.label.slice(account.label.indexOf("@"));
    }
  }
  account.pk = "********";

  return account;
}

export const accountsActions = accountsSlice.actions;
