import { createAsyncThunk } from "@reduxjs/toolkit";
import { fireEvent, screen } from "@testing-library/react";
import { ImplicitAccount, MnemonicAccount } from "../types/Account";
import accountsSlice from "../utils/redux/slices/accountsSlice";
import store from "../utils/redux/store";
import BigNumber from "bignumber.js";
import { estimate } from "../utils/tezos";

export const selectSender = (accountLabel: string) => {
  const input = screen.getByLabelText("From");
  fireEvent.change(input, { target: { value: accountLabel } });
};

export const fillPassword = (value: string) => {
  const passwordInput = screen.getByLabelText(/password/i);
  fireEvent.change(passwordInput, { target: { value } });
};

export const dispatchMockAccounts = (accounts: ImplicitAccount[]) => {
  store.dispatch(accountsSlice.actions.addAccount(accounts));
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

export const mockEstimatedFee = (fee: number | string | BigNumber) => {
  jest.mocked(estimate).mockResolvedValue(BigNumber(fee));
};
