import { mockImplicitAccount, rawAccountFixture } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  assetsActions,
  makeStore,
} from "@umami/state";

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
  it("renders account card without balance details", () => {
    render(<AccountCard />, { store });

    expect(screen.getByTestId("account-tile")).toBeVisible();
    expect(screen.getByTestId("account-balance")).toBeVisible();
    expect(screen.queryByTestId("balance-details")).not.toBeInTheDocument();
    expect(screen.getByTestId("account-buttons")).toBeVisible();
  });
  it("renders account card with balance details", () => {
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({
          address: account.address.pkh,
        }),
      ])
    );
    render(<AccountCard />, { store });

    expect(screen.getByTestId("account-tile")).toBeVisible();
    expect(screen.getByTestId("account-balance")).toBeVisible();
    expect(screen.getByTestId("balance-details")).toBeVisible();
    expect(screen.getByTestId("account-buttons")).toBeVisible();
  });
});
