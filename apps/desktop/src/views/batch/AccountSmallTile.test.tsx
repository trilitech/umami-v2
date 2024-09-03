import { mockImplicitAccount, mockMnemonicAccount, rawAccountFixture } from "@umami/core";
import { type UmamiStore, addTestAccount, assetsActions, makeStore } from "@umami/state";
import { formatPkh } from "@umami/tezos";

import { AccountSmallTile } from "./AccountSmallTile";
import { render, screen } from "../../mocks/testUtils";

const account = mockMnemonicAccount(1, { label: "Test account label" });

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
});

describe("<AccountSmallTile />", () => {
  it("shows account label", () => {
    render(<AccountSmallTile account={account} />, { store });

    expect(screen.getByTestId("account-small-tile-label")).toHaveTextContent("Test account label");
  });

  it("shows formatted account address", () => {
    const account = mockImplicitAccount(1);

    render(<AccountSmallTile account={account} />, { store });

    expect(screen.getByTestId("account-small-tile-pkh")).toHaveTextContent(
      formatPkh(account.address.pkh)
    );
  });

  it("hides empty balance", () => {
    const account = mockImplicitAccount(1);

    render(<AccountSmallTile account={account} />, { store });

    expect(screen.queryByTestId("account-small-tile-balance")).not.toBeInTheDocument();
  });

  it("displays non-empty balance", () => {
    const account = mockImplicitAccount(1);
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({
          address: account.address.pkh,
          balance: 1234567,
        }),
      ])
    );

    render(<AccountSmallTile account={account} />, { store });

    expect(screen.getByTestId("account-small-tile-balance")).toHaveTextContent("1.234567 ꜩ");
  });
});
