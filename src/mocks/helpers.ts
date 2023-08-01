import { createAsyncThunk } from "@reduxjs/toolkit";
import { Estimate } from "@taquito/taquito";
import { fireEvent, screen } from "@testing-library/react";
import { FormOperations } from "../components/sendForm/types";
import { ImplicitAccount, MnemonicAccount } from "../types/Account";
import accountsSlice from "../utils/redux/slices/accountsSlice";
import store from "../utils/redux/store";
import { fakeTezosUtils } from "./fakeTezosUtils";

export const selectSender = (accountLabel: string) => {
  const input = screen.getByLabelText("From");
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

export const setBatchEstimationPerTransaction = (
  fakeEstimateBatch: typeof fakeTezosUtils.estimateBatch,
  suggestedFeeMutez: number
) => {
  fakeEstimateBatch.mockImplementation(async (operations: FormOperations) => {
    return operations.content.map(_ => ({ suggestedFeeMutez } as Estimate));
  });
};
