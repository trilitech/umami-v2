import { createSlice } from "@reduxjs/toolkit";
import { ImplicitAccount, AccountType } from "../../types/Account";
import { UmamiEncrypted } from "../../types/UmamiEncrypted";
import { deriveAccount, restoreFromMnemonic } from "./thunks/restoreMnemonicAccounts";

type State = {
  items: ImplicitAccount[];
  seedPhrases: Record<string, UmamiEncrypted | undefined>;
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
  },
  reducers: {
    reset: () => initialState,
    removeSecret: (state, { payload }: { type: string; payload: { fingerPrint: string } }) => {
      const { fingerPrint } = payload;
      const newAccounts = state.items.filter(
        a => !(a.type === AccountType.MNEMONIC && a.seedFingerPrint === fingerPrint)
      );
      state.items = newAccounts;
      delete state.seedPhrases[fingerPrint];
    },
    add: (state, { payload }: { type: string; payload: ImplicitAccount | ImplicitAccount[] }) => {
      const accounts = Array.isArray(payload) ? payload : [payload];

      state.items = concatUnique(state.items, accounts);
    },
  },
});

const concatUnique = (existingAccounts: ImplicitAccount[], newAccounts: ImplicitAccount[]) => {
  newAccounts.forEach(newAccount => {
    if (existingAccounts.some(existingAccount => existingAccount.pkh === newAccount.pkh)) {
      throw new Error(`Can't add account ${newAccount.pkh} in store since it already exists.`);
    }
  });

  return [...existingAccounts, ...newAccounts];
};

export default accountsSlice;
