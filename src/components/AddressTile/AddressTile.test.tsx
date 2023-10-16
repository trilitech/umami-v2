import { mockImplicitAccount, mockSocialOrLedgerAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { Address } from "../../types/Address";
import { formatPkh } from "../../utils/formatPkh";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import store from "../../utils/redux/store";
import AddressTile from "./AddressTile";

const fixture = (address: Address) => <AddressTile address={address} />;

describe("<AddressTileIcon />", () => {
  it("displays label", async () => {
    const account = mockSocialOrLedgerAccount(0);
    store.dispatch(accountsSlice.actions.addAccount([account]));
    render(fixture(account.address));
    expect(screen.getByText("google Account 0")).toBeInTheDocument();
  });

  describe("address", () => {
    it("formats known address", async () => {
      const account = mockSocialOrLedgerAccount(0);
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

  describe("balance", () => {
    it("hides balance", async () => {
      const account = mockImplicitAccount(0);
      render(fixture(account.address));
      expect(screen.queryByTestId("pretty-number")).not.toBeInTheDocument();
    });

    it("shows balance if account holds tez", async () => {
      const account = mockSocialOrLedgerAccount(0);
      store.dispatch(accountsSlice.actions.addAccount([account]));
      store.dispatch(
        assetsActions.updateTezBalance([
          { address: mockImplicitAccount(0).address.pkh, balance: 5000000 },
        ])
      );
      render(fixture(account.address));
      expect(screen.getByTestId("pretty-number")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText(".000000 ꜩ")).toBeInTheDocument();
    });
  });
});
