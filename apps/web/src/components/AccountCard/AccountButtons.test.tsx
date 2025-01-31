import { mockImplicitAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  makeStore,
  networksActions,
} from "@umami/state";
import { GHOSTNET, MAINNET } from "@umami/tezos";

import { AccountButtons } from "./AccountButtons";
import { act, render, screen, userEvent, waitFor, within } from "../../testUtils";

let store: UmamiStore;
const account = mockImplicitAccount(0);

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<AccountButtons />", () => {
  it("renders a buy tez link for mainnet", () => {
    store.dispatch(networksActions.setCurrent(MAINNET));

    render(<AccountButtons />, { store });

    const link = screen.getByRole("link", { name: "Buy" });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute(
      "href",
      "https://widget.wert.io/default/widget/?commodity=XTZ&address=tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h&network=tezos&commodity_id=xtz.simple.tezos"
    );
  });

  it("renders a buy tez link for ghostnet", () => {
    store.dispatch(networksActions.setCurrent(GHOSTNET));

    render(<AccountButtons />, { store });

    const link = screen.getByRole("link", { name: "Buy" });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute("href", "https://faucet.ghostnet.teztnets.com/");
  });

  it("renders a receive button", () => {
    render(<AccountButtons />, { store });

    expect(screen.getByRole("button", { name: "Receive" })).toBeVisible();
  });

  it("renders a send button", async () => {
    const user = userEvent.setup();
    render(<AccountButtons />, { store });

    const button = screen.getByRole("button", { name: "Send" });

    expect(button).toBeVisible();

    await waitFor(async () => {
      await act(() => user.click(button));
    });

    await waitFor(() =>
      expect(
        within(screen.getByRole("dialog")).getByRole("heading", { name: "Send" })
      ).toBeVisible()
    );
  });

  describe("if user is unverified", () => {
    beforeEach(() => {
      store.dispatch(
        accountsActions.setIsVerified({ pkh: account.address.pkh, isVerified: false })
      );
    });

    it.each(["Buy", "Send", "Receive"])("%s button is disabled", buttonName => {
      render(<AccountButtons />, { store });

      const button = screen.getByLabelText(buttonName);

      // eslint-disable-next-line jest-dom/prefer-enabled-disabled
      expect(button).toHaveAttribute("disabled");
    });
  });
});
