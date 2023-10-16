import { useAccountsFilter } from "./useAccountsFilter";
import { mockSocialOrLedgerAccount } from "../mocks/factories";
import { fireEvent, screen } from "../mocks/testUtils";
import accountsSlice from "../utils/redux/slices/accountsSlice";
import store from "../utils/redux/store";
import { ReduxStore } from "../providers/ReduxStore";
import { render } from "@testing-library/react";

const accounts = [
  mockSocialOrLedgerAccount(0),
  mockSocialOrLedgerAccount(1),
  mockSocialOrLedgerAccount(2),
];

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addAccount(accounts));
});

const TestComponent = () => {
  const { accountsFilter } = useAccountsFilter();
  return accountsFilter;
};

const fixture = () => {
  return (
    <ReduxStore>
      <TestComponent />
    </ReduxStore>
  );
};

describe("useAccountsFilter", () => {
  test("Clicking account filter should display a list of all the accounts in store", () => {
    render(fixture());
    fireEvent.click(screen.getByTestId("account-filter"));
    const listItems = screen.getAllByTestId("address-tile");
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent(accounts[0].label);
    expect(listItems[1]).toHaveTextContent(accounts[1].label);
    expect(listItems[2]).toHaveTextContent(accounts[2].label);
  });

  test("selected accounts are removed from the list and added as pills", () => {
    render(fixture());

    fireEvent.click(screen.getByTestId("account-filter"));
    const listItems = screen.getAllByTestId("address-tile");
    fireEvent.click(listItems[0]);
    fireEvent.click(listItems[2]);
    {
      const listItems = screen.getAllByTestId("address-tile");
      expect(listItems).toHaveLength(1);
      expect(listItems[0]).toHaveTextContent(accounts[1].label);
    }

    const pills = screen.getAllByTestId("account-pill");
    expect(pills).toHaveLength(2);
    expect(pills[0]).toHaveTextContent(accounts[0].label);
    expect(pills[1]).toHaveTextContent(accounts[2].label);
  });

  test("account pills can be removed", () => {
    render(fixture());

    fireEvent.click(screen.getByTestId("account-filter"));
    const listItems = screen.getAllByTestId("address-tile");
    fireEvent.click(listItems[0]);
    fireEvent.click(listItems[2]);

    const pills = screen.getAllByTestId("account-pill");
    expect(pills).toHaveLength(2);
    expect(pills[0]).toHaveTextContent(accounts[0].label);
    expect(pills[1]).toHaveTextContent(accounts[2].label);
    fireEvent.click(screen.getAllByTestId("xmark-icon-path")[0]);

    {
      const pills = screen.getAllByTestId("account-pill");
      expect(pills).toHaveLength(1);
      expect(pills[0]).toHaveTextContent(accounts[2].label);
    }
  });
});
