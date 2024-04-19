import { useSearchParams } from "react-router-dom";

import { useAccountsFilter } from "./useAccountsFilter";
import { mockMnemonicAccount } from "../mocks/factories";
import { addAccount } from "../mocks/helpers";
import { UserEvent, act, render, renderHook, screen, userEvent } from "../mocks/testUtils";

const accounts = [mockMnemonicAccount(0), mockMnemonicAccount(1), mockMnemonicAccount(2)];

beforeEach(() => accounts.forEach(addAccount));

const TestComponent = () => {
  const { accountsFilter } = useAccountsFilter();
  return accountsFilter;
};

const getAccountListItems = () => screen.getAllByTestId("address-tile");

describe("AccountsFilter", () => {
  describe("initial state", () => {
    describe("with no pre-selected accounts", () => {
      it("doesn't display account pills", () => {
        render(<TestComponent />);

        expect(screen.queryByTestId("account-pill")).not.toBeInTheDocument();
      });

      it("doesn't set 'accounts' query param", () => {
        const { result: routerHook } = renderHook(() => useSearchParams());
        const [searchParams, _] = routerHook.current;

        render(<TestComponent />);

        expect(searchParams.getAll("accounts")).toEqual([]);
      });

      it("displays a list of all accounts on click", async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        await act(() => user.click(screen.getByTestId("account-filter")));

        const listItems = screen.getAllByTestId("address-tile");
        expect(listItems).toHaveLength(3);
        expect(listItems[0]).toHaveTextContent(accounts[0].label);
        expect(listItems[1]).toHaveTextContent(accounts[1].label);
        expect(listItems[2]).toHaveTextContent(accounts[2].label);
      });
    });

    describe("with pre-selected accounts", () => {
      const preSelectedAccounts = [accounts[0].address.pkh, accounts[2].address.pkh];

      it("displays pre-selected accounts as pills", () => {
        const { result: routerHook } = renderHook(() => useSearchParams());
        const [_, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: preSelectedAccounts }));
        render(<TestComponent />);

        const pills = screen.getAllByTestId("account-pill");
        expect(pills).toHaveLength(2);
        expect(pills[0]).toHaveTextContent(accounts[0].label);
        expect(pills[1]).toHaveTextContent(accounts[2].label);
      });

      it("doesn't change 'accounts' query param", () => {
        const { result: routerHook } = renderHook(() => useSearchParams());
        let [searchParams, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: preSelectedAccounts }));
        render(<TestComponent />);

        [searchParams, setSearchParams] = routerHook.current;
        expect(searchParams.getAll("accounts")).toEqual(preSelectedAccounts);
      });

      it("displays a list of remaining accounts on click", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        const [_, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: preSelectedAccounts }));
        render(<TestComponent />);

        await act(() => user.click(screen.getByTestId("account-filter")));

        const listItems = screen.getAllByTestId("address-tile");
        expect(listItems).toHaveLength(1);
        expect(listItems[0]).toHaveTextContent(accounts[1].label);
      });
    });
  });

  describe("actions", () => {
    const selectAccountListItems = async (
      user: UserEvent,
      accountIndexes: number[],
      expectedPillsLength?: number
    ) => {
      await act(() => user.click(screen.getByTestId("account-filter")));

      const listItems = getAccountListItems();
      for (const accountIndex of accountIndexes) {
        await act(() => user.click(listItems[accountIndex]));
      }

      expect(screen.getAllByTestId("account-pill")).toHaveLength(
        expectedPillsLength || accountIndexes.length
      );
    };

    describe("with no pre-selected accounts", () => {
      it("removes selected accounts from the list", async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        await selectAccountListItems(user, [0, 2]);

        expect(getAccountListItems()).toHaveLength(1);
        expect(getAccountListItems()[0]).toHaveTextContent(accounts[1].label);
      });

      it("adds selected accounts as pills", async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        await selectAccountListItems(user, [0, 2]);

        expect(screen.getAllByTestId("account-pill")).toHaveLength(2);
        const pills = screen.getAllByTestId("account-pill");
        expect(pills[0]).toHaveTextContent(accounts[0].label);
        expect(pills[1]).toHaveTextContent(accounts[2].label);
      });

      it("adds selected accounts to url params", async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        await selectAccountListItems(user, [0, 2]);

        const { result: routerHook } = renderHook(() => useSearchParams());
        const [searchParams, _] = routerHook.current;
        expect(searchParams.getAll("accounts")).toEqual([
          accounts[0].address.pkh,
          accounts[2].address.pkh,
        ]);
      });

      it("removes account pills on click", async () => {
        const user = userEvent.setup();
        render(<TestComponent />);
        await selectAccountListItems(user, [0, 2]);

        // remove first added account
        await act(() => user.click(screen.getAllByTestId("address-pill-right-icon")[0]));

        expect(screen.getAllByTestId("account-pill")).toHaveLength(1);
        expect(screen.getByTestId("account-pill")).toHaveTextContent(accounts[2].label);
      });

      it("removes un-selected accounts from url params on removing selection", async () => {
        const user = userEvent.setup();
        render(<TestComponent />);
        await selectAccountListItems(user, [0, 2]);

        // remove first added account
        await act(() => user.click(screen.getAllByTestId("address-pill-right-icon")[0]));
        () => expect(screen.getAllByTestId("account-pill")).toHaveLength(1);

        const { result: routerHook } = renderHook(() => useSearchParams());
        const [searchParams, _] = routerHook.current;
        expect(searchParams.getAll("accounts")).toEqual([accounts[2].address.pkh]);
      });

      it("makes accounts from removed account pills available for selection", async () => {
        const user = userEvent.setup();
        render(<TestComponent />);
        await selectAccountListItems(user, [0, 2]);

        // remove last added account - accounts[2]
        await act(() => user.click(screen.getAllByTestId("xmark-icon-path")[0]));

        expect(getAccountListItems()).toHaveLength(2);
        expect(getAccountListItems()[0]).toHaveTextContent(accounts[0].label);
        expect(getAccountListItems()[1]).toHaveTextContent(accounts[1].label);
      });
    });

    describe("with pre-selected accounts", () => {
      it("removes selected accounts from the list", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        const [_, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: [accounts[0].address.pkh] }));
        render(<TestComponent />);

        // select accounts[2], wait for the second pill to appear
        await selectAccountListItems(user, [1], 2);

        expect(getAccountListItems()).toHaveLength(1);
        expect(getAccountListItems()[0]).toHaveTextContent(accounts[1].label);
      });

      it("adds selected accounts as pills", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        const [_, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: [accounts[0].address.pkh] }));
        render(<TestComponent />);

        // select accounts[2], wait for the second pill to appear
        await selectAccountListItems(user, [1], 2);

        expect(screen.getAllByTestId("account-pill")).toHaveLength(2);
        const pills = screen.getAllByTestId("account-pill");
        expect(pills[0]).toHaveTextContent(accounts[0].label); // preselected
        expect(pills[1]).toHaveTextContent(accounts[2].label); // added in a test
      });

      it("adds selected accounts to url params", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        let [searchParams, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: [accounts[0].address.pkh] }));
        render(<TestComponent />);

        // select accounts[2], wait for the second pill to appear
        await selectAccountListItems(user, [1], 2);

        // Little hack to get the updated searchParams
        const { result: routerHook2 } = renderHook(() => useSearchParams());
        [searchParams, setSearchParams] = routerHook2.current;

        expect(searchParams.getAll("accounts")).toEqual([
          accounts[0].address.pkh,
          accounts[2].address.pkh,
        ]);
      });

      it("removes pre-selected account pills on click", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        const [_, setSearchParams] = routerHook.current;
        act(() =>
          setSearchParams({ accounts: [accounts[0].address.pkh, accounts[2].address.pkh] })
        );
        render(<TestComponent />);

        await act(() => user.click(screen.getAllByTestId("xmark-icon-path")[0]));

        expect(screen.getAllByTestId("account-pill")).toHaveLength(1);
        expect(screen.getByTestId("account-pill")).toHaveTextContent(accounts[2].label);
      });

      it("removes newly added account pills on click", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        const [_, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: [accounts[2].address.pkh] }));
        render(<TestComponent />);
        // select accounts[0], wait for the second pill to appear
        await selectAccountListItems(user, [0], 2);

        // remove last added account - accounts[0]
        await act(() => user.click(screen.getAllByTestId("xmark-icon-path")[1]));

        expect(screen.getAllByTestId("account-pill")).toHaveLength(1);
        expect(screen.getByTestId("account-pill")).toHaveTextContent(accounts[2].label);
      });

      it("removes un-selected pre-selected accounts from url params on removing selection", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        let [searchParams, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: [accounts[2].address.pkh] }));
        render(<TestComponent />);
        // select accounts[0], wait for the second pill to appear
        await selectAccountListItems(user, [0], 2);

        // remove first added account - accounts[2]
        await act(() => user.click(screen.getAllByTestId("xmark-icon-path")[0]));
        expect(screen.getAllByTestId("account-pill")).toHaveLength(1);

        const { result: routerHook2 } = renderHook(() => useSearchParams());
        [searchParams, setSearchParams] = routerHook2.current;
        expect(searchParams.getAll("accounts")).toEqual([accounts[0].address.pkh]);
      });

      it("removes un-selected newly-added accounts from url params on removing selection", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        let [searchParams, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: [accounts[2].address.pkh] }));
        render(<TestComponent />);
        // select accounts[0], wait for the second pill to appear
        await selectAccountListItems(user, [0], 2);

        // remove last added account - accounts[0]
        await act(() => user.click(screen.getAllByTestId("xmark-icon-path")[1]));
        expect(screen.getAllByTestId("account-pill")).toHaveLength(1);

        const { result: routerHook2 } = renderHook(() => useSearchParams());
        [searchParams, setSearchParams] = routerHook2.current;
        expect(searchParams.getAll("accounts")).toEqual([accounts[2].address.pkh]);
      });

      it("makes accounts from removed pre-selected account pills available for selection", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        const [_, setSearchParams] = routerHook.current;
        act(() =>
          setSearchParams({ accounts: [accounts[0].address.pkh, accounts[2].address.pkh] })
        );
        render(<TestComponent />);

        await act(() => user.click(screen.getAllByTestId("xmark-icon-path")[0]));

        expect(getAccountListItems()).toHaveLength(2);
        expect(getAccountListItems()[0]).toHaveTextContent(accounts[0].label);
        expect(getAccountListItems()[1]).toHaveTextContent(accounts[1].label);
      });

      it("makes accounts from removed newly added account pills available for selection", async () => {
        const user = userEvent.setup();
        const { result: routerHook } = renderHook(() => useSearchParams());
        const [_, setSearchParams] = routerHook.current;
        act(() => setSearchParams({ accounts: [accounts[2].address.pkh] }));
        render(<TestComponent />);
        // select accounts[0], wait for the second pill to appear
        await selectAccountListItems(user, [0], 2);

        // remove last added account - accounts[0]
        await act(() => user.click(screen.getAllByTestId("xmark-icon-path")[1]));

        expect(getAccountListItems()).toHaveLength(2);
        expect(getAccountListItems()[0]).toHaveTextContent(accounts[0].label);
        expect(getAccountListItems()[1]).toHaveTextContent(accounts[1].label);
      });
    });
  });
});
