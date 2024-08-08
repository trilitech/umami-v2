import { mockMnemonicAccount, rawAccountFixture } from "@umami/core";
import { type UmamiStore, addTestAccount, assetsActions, makeStore } from "@umami/state";
import { formatPkh } from "@umami/tezos";

import { AddressTile } from "./AddressTile";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<AddressTileIcon />", () => {
  it("displays label", () => {
    const account = mockMnemonicAccount(0);
    addTestAccount(store, account);

    render(<AddressTile address={account.address} />, { store });

    expect(screen.getByText("Account")).toBeVisible();
  });

  describe("address", () => {
    it("is formatted when known", () => {
      const account = mockMnemonicAccount(0);
      addTestAccount(store, account);

      render(<AddressTile address={account.address} />, { store });

      expect(screen.getByText(formatPkh(account.address.pkh))).toBeVisible();
    });

    it("is not formatted when unknown", () => {
      const account = mockMnemonicAccount(0);

      render(<AddressTile address={account.address} />, { store });

      expect(screen.getByText(account.address.pkh)).toBeVisible();
    });
  });

  describe("balance", () => {
    it("is hidden when empty", () => {
      const account = mockMnemonicAccount(0);

      render(<AddressTile address={account.address} />, { store });

      expect(screen.queryByTestId("pretty-number")).not.toBeInTheDocument();
    });

    it('is hidden when "hideBalance" is true', () => {
      const account = mockMnemonicAccount(0);
      addTestAccount(store, account);
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({ address: mockMnemonicAccount(0).address.pkh, balance: 5000000 }),
        ])
      );

      render(<AddressTile address={account.address} />, { store });

      expect(screen.queryByTestId("pretty-number")).not.toBeInTheDocument();
    });
  });
});
