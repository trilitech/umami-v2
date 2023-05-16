import { createAsyncThunk } from "@reduxjs/toolkit";
import { fireEvent, screen } from "@testing-library/react";
import { Account, MnemonicAccount } from "../types/Account";
import accountsSlice from "../utils/store/accountsSlice";
import { store } from "../utils/store/store";

export const fillAccountSelector = (accountLabel: string) => {
  const accountSelector = screen.getByTestId(/account-selector/i);
  fireEvent.click(accountSelector);

  const item = screen.getByLabelText(accountLabel);
  fireEvent.click(item);
};

export const fillPassword = (value: string) => {
  const passwordInput = screen.getByLabelText(/password/i);
  fireEvent.change(passwordInput, { target: { value } });
};

export const closeModal = () => {
  const closeModalButton = screen.getByLabelText("Close");
  fireEvent.click(closeModalButton);
};

export const dispatchMockAccounts = (accounts: Account[]) => {
  store.dispatch(accountsSlice.actions.add(accounts));
};

export const resetAccounts = () => {
  store.dispatch(accountsSlice.actions.reset());
};

export const fakeRestoreFromMnemonic = createAsyncThunk(
  "accounts/restoreFromMnemonic",
  async ({
    seedFingerprint,
    accounts,
  }: {
    seedFingerprint: string;
    accounts: MnemonicAccount[];
  }) => {
    return {
      seedFingerprint,
      accounts,
      encryptedMnemonic: {} as any,
    };
  }
);
