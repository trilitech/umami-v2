import { mockLedgerAccount, mockMnemonicAccount, mockSocialAccount } from "@umami/core";
import { addTestAccount, store } from "@umami/state";

import { RenameRemoveMenuSwitch } from "./RenameRemoveMenuSwitch";
import { act, render, screen, userEvent } from "../../mocks/testUtils";
import { WalletClient } from "../../utils/beacon/WalletClient";

beforeEach(() => {
  jest.spyOn(WalletClient, "getPeers").mockResolvedValue([]);
});

describe("<RenameRemoveMenuSwitch />", () => {
  it("shows removal message", async () => {
    const user = userEvent.setup();
    const social = mockSocialAccount(1);
    addTestAccount(mockMnemonicAccount(0));
    addTestAccount(social);
    render(<RenameRemoveMenuSwitch account={social} />);

    await act(() => user.click(screen.getByTestId("popover-cta")));
    await act(() => user.click(screen.getByTestId("popover-remove")));

    expect(screen.getByTestId("description")).toHaveTextContent(
      "Are you sure you want to remove this account?"
    );
  });

  it("shows offboarding message for last account", async () => {
    const user = userEvent.setup();
    const social = mockSocialAccount(0);
    addTestAccount(social);
    render(<RenameRemoveMenuSwitch account={social} />);

    await act(() => user.click(screen.getByTestId("popover-cta")));
    await act(() => user.click(screen.getByTestId("popover-remove")));

    expect(screen.getByTestId("description")).toHaveTextContent(
      "Removing your last account will off-board you from Umami. " +
        "This will remove or reset all customized settings to their defaults. " +
        "Personal data (including saved contacts, password and accounts) won't be affected."
    );
  });

  it.each([mockSocialAccount(0), mockLedgerAccount(0)])(
    "removes only the $type account",
    async account => {
      const allAccounts = [mockSocialAccount(0), mockLedgerAccount(1), mockMnemonicAccount(2)];
      allAccounts.forEach(addTestAccount);
      const user = userEvent.setup();

      render(<RenameRemoveMenuSwitch account={account} />);

      expect(store.getState().accounts.items).toEqual(allAccounts);

      await act(() => user.click(screen.getByTestId("popover-cta")));
      await act(() => user.click(screen.getByTestId("popover-remove")));
      await act(() => user.click(screen.getByRole("button", { name: "Remove Account" })));

      expect(store.getState().accounts.items).toEqual(
        allAccounts.filter(acc => acc.address.pkh !== account.address.pkh)
      );
    }
  );
});
