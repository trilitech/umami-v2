import { mockContract, mockPkh } from "../mocks/factories";
import { buildAccountToMultisigsMap } from "./multisig/helpers";
import { multisigActions } from "./store/multisigsSlice";
import { store } from "./store/store";

afterEach(() => {
  store.dispatch(multisigActions.reset());
});

describe("Contacts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().multisigs).toEqual({});
  });

  test("should set new multisigs", () => {
    const accountToMultisigs = buildAccountToMultisigsMap(
      [
        {
          balance: "1",
          address: mockContract(0),
          signers: [mockPkh(0)],
          threshold: 1,
          operations: [],
        },
      ],
      new Set([mockPkh(0)])
    );
    store.dispatch(multisigActions.set(accountToMultisigs));
    expect(store.getState().multisigs).toEqual({
      [mockPkh(0)]: [
        {
          address: mockContract(0),
          balance: "1",
          operations: [],
          signers: [mockPkh(0)],
          threshold: 1,
        },
      ],
    });
  });
});
