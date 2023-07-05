import { render, screen } from "@testing-library/react";
import { mockImplicitAccount } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import TokensView, { getFilteredAccounts } from "./TokensView";

const fixture = () => (
  <ReduxStore>
    <TokensView />
  </ReduxStore>
);

describe("<TokensView />", () => {
  it("a message 'no tokens found' is displayed", () => {
    render(fixture());
    expect(screen.getByText(/no tokens found/i)).toBeInTheDocument();
  });

  test("getFilteredAccounts returns the right value", () => {
    const accounts = [mockImplicitAccount(0), mockImplicitAccount(1), mockImplicitAccount(2)];

    expect(getFilteredAccounts(accounts, [mockImplicitAccount(1).address])).toEqual([
      mockImplicitAccount(1),
    ]);
    expect(getFilteredAccounts(accounts, [mockImplicitAccount(5).address])).toEqual([]);

    expect(getFilteredAccounts(accounts, [])).toEqual(accounts);
    expect(
      getFilteredAccounts(accounts, [
        mockImplicitAccount(0).address,
        mockImplicitAccount(1).address,
        mockImplicitAccount(2).address,
      ])
    ).toEqual(accounts);
  });
});
