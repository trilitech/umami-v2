import { RenameRemoveMenuSwitch } from "./RenameRemoveMenuSwitch";
import { mockMnemonicAccount, mockSocialAccount } from "../../mocks/factories";
import { fireEvent, render, screen } from "../../mocks/testUtils";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { store } from "../../utils/redux/store";

describe("<RenameRemoveMenuSwitch />", () => {
  it("shows removal message", () => {
    const mnemonic = mockMnemonicAccount(0);
    const social = mockSocialAccount(1);
    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mnemonic]));
    store.dispatch(accountsSlice.actions.addAccount(social));
    render(<RenameRemoveMenuSwitch account={social} />);

    fireEvent.click(screen.getByTestId("popover-cta"));
    fireEvent.click(screen.getByTestId("popover-remove"));
    expect(screen.getByTestId("description")).toHaveTextContent(
      "Are you sure you want to remove this account?"
    );
  });

  it("shows offboarding message for last account", () => {
    const social = mockSocialAccount(0);
    store.dispatch(accountsSlice.actions.addAccount(social));
    render(<RenameRemoveMenuSwitch account={social} />);

    fireEvent.click(screen.getByTestId("popover-cta"));
    fireEvent.click(screen.getByTestId("popover-remove"));
    expect(screen.getByTestId("description")).toHaveTextContent(
      "Removing your last account will off-board your from Umami. This will remove or reset all customised settings to their defaults. Personal data -including saved contacts, password and accounts- won't be affected."
    );
  });
});
