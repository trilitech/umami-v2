import { AddressTile } from "./AddressTile";
import { mockMnemonicAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { act, render, screen, userEvent } from "../../mocks/testUtils";
import { formatPkh } from "../../utils/format";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import { store } from "../../utils/redux/store";

describe("<AddressTileIcon />", () => {
  it("displays label", () => {
    const account = mockMnemonicAccount(0);
    addAccount(account);

    render(<AddressTile address={account.address} />);

    expect(screen.getByText("Account")).toBeVisible();
  });

  describe("Full name tooltip", () => {
    it("is hidden when cursor is not on account label", () => {
      const account = mockMnemonicAccount(0);
      addAccount(account);

      render(<AddressTile address={account.address} />);

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("is shown when cursor is on account tile", async () => {
      const user = userEvent.setup();
      const account = mockMnemonicAccount(0);
      addAccount(account);

      render(<AddressTile address={account.address} />);

      await act(() => user.hover(screen.getByTestId("address-tile")));
      const tooltip = await screen.findByRole("tooltip");

      expect(tooltip).not.toBeVisible();
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent("Account");
    });
  });

  describe("address", () => {
    it("is formatted when known", () => {
      const account = mockMnemonicAccount(0);
      addAccount(account);

      render(<AddressTile address={account.address} />);

      expect(screen.getByText(formatPkh(account.address.pkh))).toBeVisible();
    });

    it("is not formatted when unknown", () => {
      const account = mockMnemonicAccount(0);

      render(<AddressTile address={account.address} />);

      expect(screen.getByText(account.address.pkh)).toBeVisible();
    });
  });

  describe("balance", () => {
    it("is hidden when empty", () => {
      const account = mockMnemonicAccount(0);

      render(<AddressTile address={account.address} />);

      expect(screen.queryByTestId("pretty-number")).not.toBeInTheDocument();
    });

    it("is shown when it holds tez", () => {
      const account = mockMnemonicAccount(0);
      addAccount(account);
      store.dispatch(
        assetsActions.updateTezBalance([
          { address: mockMnemonicAccount(0).address.pkh, balance: 5000000 },
        ])
      );

      render(<AddressTile address={account.address} />);

      expect(screen.getByTestId("pretty-number")).toBeVisible();
      expect(screen.getByText("5")).toBeVisible();
      expect(screen.getByText(".000000 ꜩ")).toBeVisible();
    });

    it('is hidden when "hideBalance" is true', () => {
      const account = mockMnemonicAccount(0);
      addAccount(account);
      store.dispatch(
        assetsActions.updateTezBalance([
          { address: mockMnemonicAccount(0).address.pkh, balance: 5000000 },
        ])
      );

      render(<AddressTile address={account.address} hideBalance />);

      expect(screen.queryByTestId("pretty-number")).not.toBeInTheDocument();
    });
  });
});
