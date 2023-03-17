import { createSlice } from "@reduxjs/toolkit";
import { Account } from "../../types/Account";
import { UmamiEncrypted } from "../../types/UmamiEncrypted";

type State = {
  items: Account[];
  selected: null | string;
  secureStorage: Record<string, UmamiEncrypted>;
};

const initialState: State = {
  items: [],
  selected: null,
  secureStorage: {},
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
      state.secureStorage[hash] = secret;
    },
    add: (
      state,
      { payload }: { type: string; payload: Account | Account[] }
    ) => {
      const accounts = Array.isArray(payload) ? payload : [payload];

      const newAccounts = accounts.reduce(addAccount, state.items);
      state.items = newAccounts;
    },
    setSelected: (state, { payload }: { type: string; payload: string }) => {
      if (state.items.some((a) => a.pkh === payload)) {
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
