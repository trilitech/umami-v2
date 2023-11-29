import { render, screen, waitFor } from "@testing-library/react";

import { MasterPassword } from "./MasterPassword";
import { mockMnemonicAccount } from "../../../mocks/factories";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { ReduxStore } from "../../../providers/ReduxStore";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { store } from "../../../utils/redux/store";

const onClose = jest.fn(() => {});

const account = mockMnemonicAccount(0);

const fixture = () => {
  const account = {
    type: "mnemonic" as const,
    mnemonic: mnemonic1,
    label: "Some Account",
    derivationPath: "any",
  };
  return (
    <ReduxStore>
      <MasterPassword account={account} onClose={onClose} />
    </ReduxStore>
  );
};

describe("<MasterPassword />", () => {
  test("Display set password", async () => {
    render(fixture());
    const confirmation = screen.getByTestId("confirmation");
    await waitFor(() => {
      expect(confirmation).toBeInTheDocument();
    });
  });

  test("Display enter password", async () => {
    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));
    render(fixture());
    const confirmation = screen.getByTestId("confirmation");
    await waitFor(() => {
      expect(confirmation).toBeInTheDocument();
    });
  });
});
