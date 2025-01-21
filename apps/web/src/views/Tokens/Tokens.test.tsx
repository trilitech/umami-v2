import { mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  makeStore,
  networksActions,
} from "@umami/state";
import { GHOSTNET, MAINNET } from "@umami/tezos";

import { Tokens } from "./Tokens";
import { render, screen, waitFor } from "../../testUtils";

let store: UmamiStore;
const account = mockImplicitAccount(0);

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<Tokens />", () => {
  beforeEach(() => {
    addTestAccount(store, mockMnemonicAccount(1));
    addTestAccount(store, mockMnemonicAccount(2));
    store.dispatch(networksActions.setCurrent(MAINNET));
  });

  describe("without tokens", () => {
    it("displays an empty state", async () => {
      render(<Tokens />, { store });

      await waitFor(() => {
        expect(screen.getByTestId("empty-state-message")).toBeVisible();
      });

      expect(screen.getByText("Get started with tokens")).toBeVisible();
      expect(
        screen.getByText("You need tez to take part in any activity. Buy some to get started.")
      ).toBeVisible();
      expect(screen.getByText("Buy tez now")).toBeVisible();
      expect(screen.queryByTestId("token-card")).not.toBeInTheDocument();
    });

    it("has correct mainnet Buy Tez link", async () => {
      store.dispatch(networksActions.setCurrent(MAINNET));
      render(<Tokens />, { store });

      await waitFor(() => {
        expect(screen.getByTestId("empty-state-message")).toBeVisible();
      });
      const link = screen.getByRole("link", { name: "Buy tez now" });
      expect(link).toHaveAttribute(
        "href",
        `https://widget.wert.io/default/widget/?commodity=XTZ&address=${account.address.pkh}&network=tezos&commodity_id=xtz.simple.tezos`
      );
    });

    it("has correct ghostnet Buy Tez link", async () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));
      render(<Tokens />, { store });

      await waitFor(() => {
        expect(screen.getByTestId("empty-state-message")).toBeVisible();
      });
      const link = screen.getByRole("link", { name: "Buy tez now" });
      expect(link).toBeVisible();
      expect(link).toHaveAttribute("href", "https://faucet.ghostnet.teztnets.com/");
    });
  });
});
