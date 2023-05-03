import { fireEvent, screen } from "@testing-library/react";
import { Account } from "../types/Account";
import accountsSlice from "../utils/store/accountsSlice";
import { store } from "../utils/store/store";

export const fillAccountSelector = (accountLabel: string) => {
  const accountSelector = screen.getByTestId(/account-selector/i);
  fireEvent.click(accountSelector);

  const item = screen.getByLabelText(accountLabel);
  fireEvent.click(item);
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
