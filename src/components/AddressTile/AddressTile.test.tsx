import { AddressTile } from "./AddressTile";
import { mockMnemonicAccount } from "../../mocks/factories";
import { act, render, screen, userEvent } from "../../mocks/testUtils";
import { Address } from "../../types/Address";
import { formatPkh } from "../../utils/format";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import { store } from "../../utils/redux/store";

const fixture = (address: Address) => <AddressTile address={address} />;

describe("<AddressTileIcon />", () => {
  it("displays label", () => {
    const account = mockMnemonicAccount(0);
    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));

    render(fixture(account.address));

    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  describe("Full name tooltip", () => {
    it("is hidden when cursor is not on account label", () => {
      const account = mockMnemonicAccount(0);
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));

      render(fixture(account.address));

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("is shown when cursor is on account tile", async () => {
      const user = userEvent.setup();
      const account = mockMnemonicAccount(0);
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));

      render(fixture(account.address));

      await act(() => user.hover(screen.getByTestId("address-tile")));
      const tooltip = await screen.findByRole("tooltip");

      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent("Account");
    });
  });

  describe("address", () => {
    it("is formatted when known", () => {
      const account = mockMnemonicAccount(0);
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));

      render(fixture(account.address));

      expect(screen.getByText(formatPkh(account.address.pkh))).toBeInTheDocument();
    });

    it("is not formatted when unknown", () => {
      const account = mockMnemonicAccount(0);

      render(fixture(account.address));

      expect(screen.getByText(account.address.pkh)).toBeInTheDocument();
    });
  });

  describe("balance", () => {
    it("is hidden when empty", () => {
      const account = mockMnemonicAccount(0);

      render(fixture(account.address));

      expect(screen.queryByTestId("pretty-number")).not.toBeInTheDocument();
    });

    it("is shown when it holds tez", () => {
      const account = mockMnemonicAccount(0);
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));
      store.dispatch(
        assetsActions.updateTezBalance([
          { address: mockMnemonicAccount(0).address.pkh, balance: 5000000 },
        ])
      );

      render(fixture(account.address));

      expect(screen.getByTestId("pretty-number")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText(".000000 ꜩ")).toBeInTheDocument();
    });
  });
});
