import { fireEvent, screen } from "@testing-library/react";

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
