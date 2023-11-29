import { renderHook } from "@testing-library/react";
import { multisigOperation, multisigs } from "../../mocks/multisig";
import { useGetPendingMultisigOperations } from "./multisigHooks";
import { multisigToAccount } from "../multisig/helpers";
import { getWrapper } from "../../mocks/store";
import { store } from "../redux/store";
import { multisigActions } from "../redux/slices/multisigsSlice";

describe("useMultisigHooks", () => {
  it("useGetSortedMultisigPendingOperations sorts operations by id", () => {
    const operation1 = multisigOperation;
    const operation2 = { ...multisigOperation, id: "2" };
    store.dispatch(multisigActions.setMultisigs(multisigs));
    store.dispatch(multisigActions.setPendingOperations([operation1, operation2]));
    const { result: getMultisigOperationsRef } = renderHook(
      () => useGetPendingMultisigOperations(),
      {
        wrapper: getWrapper(store),
      }
    );
    expect(getMultisigOperationsRef.current(multisigToAccount(multisigs[0], "label1"))).toEqual([
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
