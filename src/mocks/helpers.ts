import { createAsyncThunk } from "@reduxjs/toolkit";
import { Estimate } from "@taquito/taquito";
import { fireEvent, screen } from "@testing-library/react";
import { ImplicitAccount, MnemonicAccount } from "../types/Account";
import accountsSlice from "../utils/store/accountsSlice";
import { store } from "../utils/store/store";
import { fakeTezosUtils } from "./fakeTezosUtils";

export const selectAccount = (accountLabel: string, label = "From") => {
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value: accountLabel } });
};

export const fillPassword = (value: string) => {
  const passwordInput = screen.getByLabelText(/password/i);
  fireEvent.change(passwordInput, { target: { value } });
};

export const closeModal = () => {
  const closeModalButton = screen.getByLabelText("Close");
  fireEvent.click(closeModalButton);
};

export const dispatchMockAccounts = (accounts: ImplicitAccount[]) => {
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

export const setBatchEstimationPerTransaction = (
  fakeEstimateBatch: typeof fakeTezosUtils.estimateBatch,
  mutez: number
) => {
  fakeEstimateBatch.mockImplementation(async (transactions: any[]) => {
    return transactions.map(_ => ({
      suggestedFeeMutez: mutez,
    })) as Estimate[];
  });
};
