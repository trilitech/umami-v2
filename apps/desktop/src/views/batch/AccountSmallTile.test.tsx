import { mockImplicitAccount, mockMnemonicAccount, rawAccountFixture } from "@umami/core";
import { addTestAccount, assetsActions, store } from "@umami/state";

import { AccountSmallTile } from "./AccountSmallTile";
import { render, screen } from "../../mocks/testUtils";
import { formatPkh } from "../../utils/format";

const account = mockMnemonicAccount(1, "Test account label");

beforeEach(() => addTestAccount(account));

describe("<AccountSmallTile />", () => {
  it("shows account label", () => {
    render(<AccountSmallTile account={account} />);

    expect(screen.getByTestId("account-small-tile-label")).toHaveTextContent("Test account label");
  });

  it("shows formatted account address", () => {
    const account = mockImplicitAccount(1);

    render(<AccountSmallTile account={account} />);

    expect(screen.getByTestId("account-small-tile-pkh")).toHaveTextContent(
      formatPkh(account.address.pkh)
    );
  });

  it("hides empty balance", () => {
    const account = mockImplicitAccount(1);

    render(<AccountSmallTile account={account} />);

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

    render(<AccountSmallTile account={account} />);

    expect(screen.getByTestId("account-small-tile-balance")).toHaveTextContent("1.234567 ꜩ");
  });
});
