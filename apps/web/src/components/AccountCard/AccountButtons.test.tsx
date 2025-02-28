import { mockImplicitAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  makeStore,
  networksActions,
  useGetAccountBalanceDetails,
} from "@umami/state";
import { GHOSTNET, MAINNET } from "@umami/tezos";
import { BigNumber } from "bignumber.js";

import { AccountButtons } from "./AccountButtons";
import { act, render, screen, userEvent, waitFor, within } from "../../testUtils";

let store: UmamiStore;
const account = mockImplicitAccount(0);

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useGetAccountBalanceDetails: jest.fn(),
}));

describe("<AccountButtons />", () => {
  beforeEach(() => {
    jest.mocked(useGetAccountBalanceDetails).mockReturnValue({
      spendableBalance: BigNumber(1000000),
      totalBalance: BigNumber(1000000),
      stakedBalance: 0,
      totalFinalizableAmount: BigNumber(1000000),
      totalPendingAmount: BigNumber(0),
    });
  });

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

  it("renders a connect button", () => {
    render(<AccountButtons />, { store });

    expect(screen.getByRole("button", { name: "Connect" })).toBeVisible();
  });

  describe("renders a send button", () => {
    it("if user has enough balance", async () => {
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

    it("if user has insufficient balance", async () => {
      jest.mocked(useGetAccountBalanceDetails).mockReturnValue({
        spendableBalance: BigNumber(0),
        totalBalance: BigNumber(0),
        stakedBalance: 0,
        totalFinalizableAmount: BigNumber(0),
        totalPendingAmount: BigNumber(0),
      });
      const user = userEvent.setup();
      render(<AccountButtons />, { store });

      const button = screen.getByRole("button", { name: "Send" });

      expect(button).toBeVisible();

      await waitFor(async () => {
        await act(() => user.click(button));
      });

      await waitFor(() =>
        expect(
          within(screen.getByRole("dialog")).getByRole("heading", { name: "Insufficient Funds" })
        ).toBeVisible()
      );
    });
  });

  describe("if user is unverified", () => {
    beforeEach(() => {
      store.dispatch(
        accountsActions.setIsVerified({ pkh: account.address.pkh, isVerified: false })
      );
    });

    it.each(["Buy", "Connect", "Send", "Receive"])("%s button is disabled", buttonName => {
      render(<AccountButtons />, { store });

      const button = screen.getByLabelText(buttonName);

      // eslint-disable-next-line jest-dom/prefer-enabled-disabled
      expect(button).toHaveAttribute("disabled");
    });
  });
});
