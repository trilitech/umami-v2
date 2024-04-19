import { AccountSmallTile } from "./AccountSmallTile";
import { mockImplicitAccount, mockMnemonicAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { render, screen } from "../../mocks/testUtils";
import { formatPkh } from "../../utils/format";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import { store } from "../../utils/redux/store";

beforeEach(() => addAccount(mockMnemonicAccount(1, "Test account label")));

describe("<AccountSmallTile />", () => {
  it("shows account label", () => {
    const account = mockImplicitAccount(1);

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
      assetsActions.updateTezBalance([{ address: account.address.pkh, balance: 1234567 }])
    );

    render(<AccountSmallTile account={account} />);

    expect(screen.getByTestId("account-small-tile-balance")).toHaveTextContent("1.234567 ꜩ");
  });
});
