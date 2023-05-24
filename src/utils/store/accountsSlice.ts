import { createSlice } from "@reduxjs/toolkit";
import { Account, AccountType } from "../../types/Account";
import { UmamiEncrypted } from "../../types/UmamiEncrypted";
import {
  deriveAccount,
  restoreFromMnemonic,
} from "./thunks/restoreMnemonicAccounts";

type State = {
  items: Account[];
  selected: null | string;
  seedPhrases: Record<string, UmamiEncrypted | undefined>;
};

const initialState: State = {
  items: [],
  selected: null,
  seedPhrases: {},
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(deriveAccount.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(restoreFromMnemonic.fulfilled, (state, action) => {
      const { accounts, encryptedMnemonic, seedFingerprint } = action.payload;
      // updated seedphrase after a successfull restoration.
      console.log("cool22");
      state.seedPhrases[seedFingerprint] = encryptedMnemonic;
      state.items = state.items.concat(accounts);
    });
  },
  reducers: {
    reset: () => initialState,
    removeSecret: (
      state,
      { payload }: { type: string; payload: { fingerPrint: string } }
    ) => {
      const { fingerPrint } = payload;
      const newAccounts = state.items.filter(
        (a) =>
          !(
            a.type === AccountType.MNEMONIC && a.seedFingerPrint === fingerPrint
          )
      );
      state.items = newAccounts;
      delete state.seedPhrases[fingerPrint];
    },
    add: (
      state,
      { payload }: { type: string; payload: Account | Account[] }
    ) => {
      const accounts = Array.isArray(payload) ? payload : [payload];

      accounts.forEach((a) => {
        if (state.items.some((existing) => existing.pkh === a.pkh)) {
          throw new Error(
            `Can't add account ${a.pkh} in store since it already exists.`
          );
        }
      });

      const newAccounts = accounts.reduce(addAccount, state.items);
      state.items = newAccounts;
    },
    setSelected: (
      state,
      { payload }: { type: string; payload: string | null }
    ) => {
      if (state.items.some((a) => a.pkh === payload || payload === null)) {
        state.selected = payload;
      }
    },
  },
});

const addAccount = (accounts: Account[], account: Account) =>
  accounts.some((a) => a.pkh === account.pkh)
    ? accounts
    : [...accounts, account];

export default accountsSlice;
