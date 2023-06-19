import { MultisigWithPendingOperations } from "./multisig/types";
import { multisigActions } from "./store/multisigsSlice";
import { store } from "./store/store";

afterEach(() => {
  store.dispatch(multisigActions.reset());
});

describe("Contacts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().multisigs).toEqual({ items: [] });
  });

  test("should set new multisigs", () => {
    const multisig: MultisigWithPendingOperations = {
      address: { type: "contract", pkh: "mockKt1" },
      balance: "44",
      pendingOperations: [],
      signers: [],
      threshold: 8,
    };
    store.dispatch(multisigActions.set([multisig]));
    expect(store.getState().multisigs).toEqual({ items: [multisig] });
  });
});
