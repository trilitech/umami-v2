import { mockImplicitAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { Address } from "../../types/Address";
import { formatPkh } from "../../utils/formatPkh";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import store from "../../utils/redux/store";
import AddressTile from "./AddressTile";

const fixture = (address: Address) => <AddressTile address={address} />;

describe("<AddressTileIcon />", () => {
  it("truncates label with length > 15", async () => {
    const account = mockImplicitAccount(0);
    account.label = "1234567890123456";
    store.dispatch(accountsSlice.actions.addAccount([account]));
    render(fixture(account.address));
    expect(screen.getByText("123456789012...")).toBeInTheDocument();
  });

  it("formats known address", async () => {
    const account = mockImplicitAccount(0);
    store.dispatch(accountsSlice.actions.addAccount([account]));
    render(fixture(account.address));
    expect(screen.getByText(formatPkh(account.address.pkh))).toBeInTheDocument();
  });

  it("doesn't format unknown address", async () => {
    const account = mockImplicitAccount(0);
    render(fixture(account.address));
    expect(screen.getByText(account.address.pkh)).toBeInTheDocument();
  });
});
