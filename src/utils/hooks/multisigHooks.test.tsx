import { renderHook } from "@testing-library/react";
import { multisigOperation, multisigs } from "../../mocks/multisig";
import { useGetSortedMultisigPendingOperations } from "./multisigHooks";
import configureStore from "redux-mock-store";
import { AnyAction, Store } from "redux";
import { Provider } from "react-redux";
import { State as MultisigState } from "../store/multisigsSlice";

const getWrapper = (store: Store<any, AnyAction>): React.FC => {
  return ({ children }: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

describe("useMultisigHooks", () => {
  const operation1 = multisigOperation;
  const operation2 = { ...multisigOperation, key: "2" };
  const initialState = {
    multisigs: {
      items: multisigs,
      pendingOperations: { 0: [operation1, operation2] },
    } as MultisigState,
  };

  const mockStore = configureStore();
  it("useGetSortedMultisigPendingOperations sorts operations by keys", () => {
    const store = mockStore(initialState);

    const { result: getMultisigOperationsRef } = renderHook(
      () => useGetSortedMultisigPendingOperations(),
      { wrapper: getWrapper(store) }
    );
    const a = getMultisigOperationsRef.current(multisigs[0].address);
    expect(a).toEqual([
      {
        id: 0,
        key: "2",
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
        id: 0,
        key: "1",
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
