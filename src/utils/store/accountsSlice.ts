import { createSlice } from "@reduxjs/toolkit";
import { Account } from "../../types/Account";

type State = {
  items: Account[];
  selected: null | string;
};

const initialState: State = {
  items: [],
  selected: null,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    reset: () => initialState,
    add: (
      state,
      { payload }: { type: string; payload: Account | Account[] }
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
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
