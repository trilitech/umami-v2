import { multisigOperationFixture, multisigsFixture } from "@umami/multisig";

import { useGetPendingMultisigOperations } from "./multisig";
import { multisigsActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import { addTestAccounts, renderHook } from "../testUtils";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("useGetPendingMultisigOperations", () => {
  it("sorts operations by id", () => {
    const operation1 = multisigOperationFixture;
    const operation2 = { ...multisigOperationFixture, id: "2" };
    addTestAccounts(store, multisigsFixture);
    store.dispatch(multisigsActions.setPendingOperations([operation1, operation2]));

    const {
      result: { current: getMultisigOperations },
    } = renderHook(() => useGetPendingMultisigOperations(), { store });

    expect(getMultisigOperations(multisigsFixture[0])).toEqual([
      {
        id: "2",
        bigmapId: 0,
        rawActions:
          '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
        approvals: [
          {
            pkh: "pkh",
            type: "implicit",
          },
        ],
      },
      {
        id: "1",
        bigmapId: 0,
        rawActions:
          '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
        approvals: [
          {
            pkh: "pkh",
            type: "implicit",
          },
        ],
      },
    ]);
  });
});
