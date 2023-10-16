import { render, screen, waitFor } from "@testing-library/react";
import MasterPassword from "./MasterPassword";
import { ReduxStore } from "../../../providers/ReduxStore";
import { mockSocialOrLedgerAccount } from "../../../mocks/factories";
import store from "../../../utils/redux/store";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import { mnemonic1 } from "../../../mocks/mockMnemonic";

const onClose = jest.fn(() => {});

const { addNonMnemonicAccount: addAccount } = accountsSlice.actions;
const account = mockSocialOrLedgerAccount(0);

const fixture = () => {
  const account = {
    type: "mnemonic" as const,
    mnemonic: mnemonic1,
    label: "Some Account",
    derivationPath: "any",
  };
  return (
    <ReduxStore>
      <MasterPassword onClose={onClose} account={account} />
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
    store.dispatch(addAccount([account]));
    render(fixture());
    const confirmation = screen.getByTestId("confirmation");
    await waitFor(() => {
      expect(confirmation).toBeInTheDocument();
    });
  });
});
