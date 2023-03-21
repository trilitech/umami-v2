import { createSlice } from "@reduxjs/toolkit";
import { Account } from "../../types/Account";
import { UmamiEncrypted } from "../../types/UmamiEncrypted";

type State = {
  items: Account[];
  selected: null | string;
  seedPhrases: Record<string, UmamiEncrypted>;
};

const initialState: State = {
  items: [],
  selected: null,
  seedPhrases: {},
};

export type SecretPayload = {
  hash: string;
  secret: UmamiEncrypted;
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    reset: () => initialState,
    addSecret: (
      state,
      { payload }: { type: string; payload: SecretPayload }
    ) => {
      const { hash, secret } = payload;
      state.seedPhrases[hash] = secret;
    },
    add: (
      state,
      { payload }: { type: string; payload: Account | Account[] }
    ) => {
      const accounts = Array.isArray(payload) ? payload : [payload];

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
