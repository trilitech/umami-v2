import { useRemoveAccountsDependencies } from "./removeAccountDependenciesHooks";
import { mockImplicitAccount, mockTezOperation } from "../../mocks/factories";
import { renderHook } from "../../mocks/testUtils";
import { makeAccountOperations } from "../../types/AccountOperations";
import { MAINNET } from "../../types/Network";
import { batchesActions } from "../redux/slices/batches";
import { store } from "../redux/store";

describe("useRemoveAccountsDependencies", () => {
  it("removes batches related to the given accounts", () => {
    const accountOperations1 = makeAccountOperations(
      mockImplicitAccount(1),
      mockImplicitAccount(1),
      [mockTezOperation(0), mockTezOperation(1)]
    );
    const accountOperations2 = makeAccountOperations(
      mockImplicitAccount(2),
      mockImplicitAccount(2),
      [mockTezOperation(1), mockTezOperation(3)]
    );
    const accountOperations3 = makeAccountOperations(
      mockImplicitAccount(3),
      mockImplicitAccount(3),
      [mockTezOperation(0)]
    );
    store.dispatch(batchesActions.add({ operations: accountOperations1, network: MAINNET }));
    store.dispatch(batchesActions.add({ operations: accountOperations2, network: MAINNET }));
    store.dispatch(batchesActions.add({ operations: accountOperations3, network: MAINNET }));

    const {
      result: { current: removeAccountsDependencies },
    } = renderHook(() => useRemoveAccountsDependencies());
    removeAccountsDependencies([mockImplicitAccount(2), mockImplicitAccount(3)]);

    expect(store.getState().batches[MAINNET.name]).toEqual([accountOperations1]);
  });
});
