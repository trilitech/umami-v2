import { Account } from "../types/Account";
import accountsSlice from "./store/accountsSlice";

import { store } from "./store/store";
const {
  actions: { add, reset, setSelected },
} = accountsSlice;

const mockAccount = (index: number): Account => {
  return {
    label: `account ${index}`,
    pkh: `mockPkh ${index}`,
    pk: `mockPk ${index}`,
    sk: `mockSk ${index}`,
  };
};

afterEach(() => {
  store.dispatch(reset());
});

describe("Accounts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().accounts).toEqual({ items: [], selected: null });
  });

  test("should handle adding accounts and arrays of accounts", () => {
    store.dispatch(add(mockAccount(1)));
    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1)],
      selected: null,
    });

    store.dispatch(add([mockAccount(2), mockAccount(3)]));
    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
    });
  });

  test("adding account should ignore duplicates", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(add(mockAccount(2)));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
    });
  });

  test("should allow setting an existing account as selected", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(setSelected(mockAccount(2).pkh));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: mockAccount(2).pkh,
    });
  });

  test("should ignore setting a non existing account as selected", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(setSelected(mockAccount(4).pkh));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
    });
  });

  test("should allow settings selected account to null", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(setSelected(mockAccount(2).pkh));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: mockAccount(2).pkh,
    });

    store.dispatch(setSelected(null));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
    });
  });
});
