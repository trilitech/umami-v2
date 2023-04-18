import { mockAccount } from "../mocks/factories";
import accountsSlice from "./store/accountsSlice";

import { store } from "./store/store";
const {
  actions: { add, reset, setSelected },
} = accountsSlice;

afterEach(() => {
  store.dispatch(reset());
});

describe("Accounts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().accounts).toEqual({
      items: [],
      selected: null,
      seedPhrases: {},
    });
  });

  test("should handle adding accounts and arrays of accounts", () => {
    store.dispatch(add(mockAccount(1)));
    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1)],
      selected: null,
      seedPhrases: {},
    });

    store.dispatch(add([mockAccount(2), mockAccount(3)]));
    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
      seedPhrases: {},
    });
  });

  test("adding account should throw and exception if it is a pkh duplicate and not modify state", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));

    expect(() => store.dispatch(add(mockAccount(2)))).toThrowError(
      `Can't add account ${
        mockAccount(2).pkh
      } in store since it already exists.`
    );

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
      seedPhrases: {},
    });
  });

  test("should allow setting an existing account as selected", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(setSelected(mockAccount(2).pkh));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: mockAccount(2).pkh,
      seedPhrases: {},
    });
  });

  test("should ignore setting a non existing account as selected", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(setSelected(mockAccount(4).pkh));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
      seedPhrases: {},
    });
  });

  test("should allow settings selected account to null", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(setSelected(mockAccount(2).pkh));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: mockAccount(2).pkh,
      seedPhrases: {},
    });

    store.dispatch(setSelected(null));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
      seedPhrases: {},
    });
  });
});
