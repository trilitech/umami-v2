import { MasterPassword } from "./MasterPassword";
import { mockMnemonicAccount } from "../../../mocks/factories";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { render, screen } from "../../../mocks/testUtils";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { store } from "../../../utils/redux/store";

const onClose = jest.fn(() => {});

const account = mockMnemonicAccount(0);

const fixture = () => {
  const account = {
    type: "mnemonic" as const,
    mnemonic: mnemonic1,
    label: "Some Account",
    derivationPathTemplate: "any",
  };
  return <MasterPassword account={account} onClose={onClose} />;
};

describe("<MasterPassword />", () => {
  test("Display set password", () => {
    render(fixture());

    expect(screen.getByTestId("confirmation")).toBeInTheDocument();
  });

  test("Display enter password", () => {
    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));
    render(fixture());

    expect(screen.getByTestId("confirmation")).toBeInTheDocument();
  });
});
