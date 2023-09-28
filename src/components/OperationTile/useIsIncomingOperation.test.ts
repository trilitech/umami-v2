import { mockImplicitAccount } from "../../mocks/factories";
import { AllTheProviders } from "../../mocks/testUtils";
import { renderHook } from "../../mocks/testUtils";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import store from "../../utils/redux/store";
import { TransactionOperation } from "../../utils/tezos";
import { useIsIncomingOperation } from "./useIsIncomingOperation";

describe("useIsIncomingOperation", () => {
  it("returns false if the operation target is not owned", () => {
    const { result } = renderHook(
      () => useIsIncomingOperation(mockImplicitAccount(0).address.pkh),
      {
        wrapper: AllTheProviders,
      }
    );
    expect(result.current).toEqual(false);
  });

  it("returns true if the operation target is in owned accounts", () => {
    store.dispatch(accountsSlice.actions.addAccount([mockImplicitAccount(0)]));

    const { result } = renderHook(
      () => useIsIncomingOperation(mockImplicitAccount(0).address.pkh),
      {
        wrapper: AllTheProviders,
      }
    );
    expect(result.current).toEqual(true);
  });
});
