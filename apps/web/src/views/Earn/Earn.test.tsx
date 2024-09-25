import { mockImplicitAccount } from "@umami/core";
import { type UmamiStore, accountsActions, addTestAccount, makeStore } from "@umami/state";

import { Earn } from "./Earn";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

const account = mockImplicitAccount(0);

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<Earn />", () => {
  it("renders correctly if user is verified", () => {
    render(<Earn />, { store });

    const link = screen.getByRole("link", { name: "Start Earning" });

    expect(screen.getByText("Boost your rewards")).toBeInTheDocument();
    expect(
      screen.getByText("Maximize your tez with staking.com. Secure, efficient, and simple.")
    ).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://stake.tezos.com/");
  });

  it("renders empty message if user is not verified", () => {
    store.dispatch(
      accountsActions.setIsVerified({
        isVerified: false,
        pkh: account.address.pkh,
      })
    );
    render(<Earn />, { store });

    expect(screen.getByTestId("empty-state-message")).toBeInTheDocument();
  });
});
