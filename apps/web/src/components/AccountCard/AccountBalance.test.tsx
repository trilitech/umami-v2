import { mockImplicitAccount, rawAccountFixture } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  assetsActions,
  makeStore,
} from "@umami/state";

import { AccountBalance } from "./AccountBalance";
import { act, render, screen, userEvent, waitFor, within } from "../../testUtils";

let store: UmamiStore;
const account = mockImplicitAccount(0);

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<AccountBalance />", () => {
  it("renders a buy tez link", () => {
    render(<AccountBalance />, { store });

    const link = screen.getByRole("link", { name: "Buy" });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute(
      "href",
      "https://widget.wert.io/default/widget/?commodity=XTZ&address=tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h&network=tezos&commodity_id=xtz.simple.tezos"
    );
  });

  it("renders a receive button", () => {
    render(<AccountBalance />, { store });

    expect(screen.getByRole("button", { name: "Receive" })).toBeVisible();
  });

  it("renders a send button", async () => {
    const user = userEvent.setup();
    render(<AccountBalance />, { store });

    const button = screen.getByRole("button", { name: "Send" });

    expect(button).toBeVisible();

    await act(() => user.click(button));

    await waitFor(() =>
      expect(
        within(screen.getByRole("dialog")).getByRole("heading", { name: "Send" })
      ).toBeVisible()
    );
  });

  describe("balance", () => {
    it("renders balance", () => {
      store.dispatch(assetsActions.updateConversionRate(2.44));
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            balance: 1234567,
          }),
        ])
      );

      render(<AccountBalance />, { store });

      expect(screen.getByTestId("tez-balance")).toHaveTextContent("1.234567 ꜩ");
      expect(screen.getByTestId("usd-balance")).toHaveTextContent("$3.02");
    });

    it("renders only tez balance if conversion rate is not available", () => {
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            balance: 1234567,
          }),
        ])
      );

      render(<AccountBalance />, { store });

      expect(screen.getByTestId("tez-balance")).toHaveTextContent("1.234567 ꜩ");
      expect(screen.queryByTestId("usd-balance")).not.toBeInTheDocument();
    });

    it("doesn't render balance if it's not available", () => {
      render(<AccountBalance />, { store });

      expect(screen.queryByTestId("tez-balance")).not.toBeInTheDocument();
      expect(screen.queryByTestId("usd-balance")).not.toBeInTheDocument();
    });
  });

  describe("if user is unverified", () => {
    beforeEach(() => {
      localStorage.setItem("user:verified", "false");
    });

    it.each(["Buy", "Send", "Receive"])("%s button is disabled", buttonName => {
      render(<AccountBalance />, { store });

      const button = screen.getByRole("button", { name: buttonName });

      expect(button).toBeDisabled();
    });
  });
});
