import { createAsyncThunk } from "@reduxjs/toolkit";
import { fireEvent, screen } from "@testing-library/react";
import { MnemonicAccount } from "../types/Account";
import accountsSlice from "../utils/redux/slices/accountsSlice";
import store from "../utils/redux/store";
import BigNumber from "bignumber.js";
import { estimate } from "../utils/tezos";

export const selectSender = (accountLabel: string) => {
  const input = screen.getByLabelText("From");
  fireEvent.change(input, { target: { value: accountLabel } });
};

export const fillPassword = (value: string) => {
  const passwordInput = screen.getByTestId("password");
  fireEvent.change(passwordInput, { target: { value } });
};

export const dispatchMockAccounts = (accounts: MnemonicAccount[]) => {
  store.dispatch(accountsSlice.actions.addMockMnemonicAccounts(accounts));
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
  jest.mocked(estimate).mockResolvedValueOnce(BigNumber(fee));
};
