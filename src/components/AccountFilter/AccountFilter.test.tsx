import { getFilteredAccounts, mapToFilteredArray, useAccountFilterUtils } from ".";
import { mockImplicitAccount } from "../../mocks/factories";
import { fireEvent, render, screen } from "../../mocks/testUtils";
import accountsSlice from "../../utils/store/accountsSlice";
import { store } from "../../utils/store/store";

const accounts = [mockImplicitAccount(0), mockImplicitAccount(1), mockImplicitAccount(2)];

beforeEach(() => {
  store.dispatch(accountsSlice.actions.add(accounts));
});

afterEach(() => {
  store.dispatch(accountsSlice.actions.reset());
});

const Fixture: React.FC = () => {
  const { filterElement } = useAccountFilterUtils();

  return filterElement;
};

describe("AccountFilter", () => {
  test("Clicking account filter should display a list of all the accounts in store", () => {
    render(<Fixture />);
    fireEvent.click(screen.getByTestId("account-filter"));
    const listItems = screen.getAllByTestId("account-small-tile");
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent(accounts[0].label);
    expect(listItems[1]).toHaveTextContent(accounts[1].label);
    expect(listItems[2]).toHaveTextContent(accounts[2].label);
  });

  test("selected accounts are removed from the list and added as pills", () => {
    render(<Fixture />);

    fireEvent.click(screen.getByTestId("account-filter"));
    const listItems = screen.getAllByTestId("account-small-tile");
    fireEvent.click(listItems[0]);
    fireEvent.click(listItems[2]);
    {
      const listItems = screen.getAllByTestId("account-small-tile");
      expect(listItems).toHaveLength(1);
      expect(listItems[0]).toHaveTextContent(accounts[1].label);
    }

    const pills = screen.getAllByTestId("account-pill");
    expect(pills).toHaveLength(2);
    expect(pills[0]).toHaveTextContent(accounts[0].label);
    expect(pills[1]).toHaveTextContent(accounts[2].label);
  });

  test("account pills can be removed", () => {
    render(<Fixture />);

    fireEvent.click(screen.getByTestId("account-filter"));
    const listItems = screen.getAllByTestId("account-small-tile");
    fireEvent.click(listItems[0]);
    fireEvent.click(listItems[2]);

    const pills = screen.getAllByTestId("account-pill");
    expect(pills).toHaveLength(2);
    expect(pills[0]).toHaveTextContent(accounts[0].label);
    expect(pills[1]).toHaveTextContent(accounts[2].label);
    fireEvent.click(screen.getByTestId(`account-pill-close-${accounts[0].address.pkh}`));

    {
      const pills = screen.getAllByTestId("account-pill");
      expect(pills).toHaveLength(1);
      expect(pills[0]).toHaveTextContent(accounts[2].label);
    }
  });

  test("mapToFilteredArray returns the right value", () => {
    expect(mapToFilteredArray({ foo: ["hello"], bar: ["cool"] }, ["foo"])).toEqual(["hello"]);
    expect(mapToFilteredArray({ foo: ["hello"], bar: ["cool"] }, [])).toEqual(["hello", "cool"]);
    expect(mapToFilteredArray({ foo: ["hello"], bar: ["cool"] }, ["baz"])).toEqual([]);
    expect(mapToFilteredArray({ foo: ["hello"], bar: ["cool"] }, ["foo", "bar"])).toEqual([
      "hello",
      "cool",
    ]);
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
