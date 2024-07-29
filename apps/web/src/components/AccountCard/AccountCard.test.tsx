import { mockImplicitAccount } from "@umami/core";
import { type UmamiStore, accountsActions, addTestAccount, makeStore } from "@umami/state";

import { AccountCard } from "./AccountCard";
import { render, screen } from "../../testUtils";

let store: UmamiStore;
const account = mockImplicitAccount(0);

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<AccountCard />", () => {
  it("renders account tile", () => {
    render(<AccountCard />, { store });

    expect(screen.getByTestId("account-tile")).toBeVisible();
  });

  it("renders account balance", () => {
    render(<AccountCard />, { store });

    expect(screen.getByTestId("account-balance")).toBeVisible();
  });
});
