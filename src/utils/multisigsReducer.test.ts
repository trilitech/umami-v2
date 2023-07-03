import { multisigOperation, multisigs } from "../mocks/multisig";
import { multisigActions } from "./store/multisigsSlice";
import { store } from "./store/store";

afterEach(() => {
  store.dispatch(multisigActions.reset());
});

describe("Contacts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().multisigs).toEqual({ items: [], pendingOperations: {} });
  });

  test("should set new multisigs", () => {
    const multisig = multisigs[0];
    store.dispatch(multisigActions.setMultisigs([multisig]));
    expect(store.getState().multisigs).toEqual({ items: [multisig], pendingOperations: {} });
  });

  test("should build mapping for multisig operations", () => {
    const operation1 = multisigOperation;
    const operation2 = { ...multisigOperation, key: "2" };
    const operation3 = { ...multisigOperation, id: 1 };
    store.dispatch(multisigActions.setPendingOperations([operation1, operation2, operation3]));
    expect(store.getState().multisigs).toEqual({
      items: [],
      pendingOperations: {
        "0": [
          {
            approvals: [
              {
                pkh: "pkh",
                type: "implicit",
              },
            ],
            id: 0,
            key: "1",
            rawActions:
              '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
          },
          {
            approvals: [
              {
                pkh: "pkh",
                type: "implicit",
              },
            ],
            id: 0,
            key: "2",
            rawActions:
              '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
          },
        ],
        "1": [
          {
            approvals: [
              {
                pkh: "pkh",
                type: "implicit",
              },
            ],
            id: 1,
            key: "1",
            rawActions:
              '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
          },
        ],
      },
    });
  });
});
