import { mockImplicitAccount, rawAccountFixture } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  assetsActions,
  makeStore,
} from "@umami/state";

import { AccountBalance } from "./AccountBalance";
import { render, screen } from "../../testUtils";

let store: UmamiStore;
const account = mockImplicitAccount(0);

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<AccountBalance />", () => {
  describe("balance", () => {
    it("renders balance", () => {
      store.dispatch(assetsActions.updateConversionRate(2.44));
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            balance: 1234567,
          }),
        ])
      );

      render(<AccountBalance />, { store });

      expect(screen.getByTestId("tez-balance")).toHaveTextContent("1.234567 ꜩ");
      expect(screen.getByTestId("usd-balance")).toHaveTextContent("$3.02 (US$2.44 / XTZ)");
    });

    it("renders only tez balance if conversion rate is not available", () => {
      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: account.address.pkh,
            balance: 1234567,
          }),
        ])
      );

      render(<AccountBalance />, { store });

      expect(screen.getByTestId("tez-balance")).toHaveTextContent("1.234567 ꜩ");
      expect(screen.queryByTestId("usd-balance")).not.toBeInTheDocument();
    });

    it("doesn't render balance if it's not available", () => {
      render(<AccountBalance />, { store });

      expect(screen.getByTestId("tez-balance")).toHaveTextContent("0 ꜩ");
      expect(screen.getByTestId("usd-balance")).toHaveTextContent("$0.00");
    });
  });
});
