import { useGetPendingMultisigOperations } from "./multisigHooks";
import { multisigOperation, multisigs } from "../../mocks/multisig";
import { renderHook } from "../../mocks/testUtils";
import { multisigActions } from "../redux/slices/multisigsSlice";
import { store } from "../redux/store";

describe("multisigHooks", () => {
  it("useGetSortedMultisigPendingOperations sorts operations by id", () => {
    const operation1 = multisigOperation;
    const operation2 = { ...multisigOperation, id: "2" };
    store.dispatch(multisigActions.setMultisigs(multisigs));
    store.dispatch(multisigActions.setPendingOperations([operation1, operation2]));

    const {
      result: { current: getMultisigOperations },
    } = renderHook(() => useGetPendingMultisigOperations());

    expect(getMultisigOperations(multisigs[0])).toEqual([
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
