import { useRemoveAccount } from "./removeAccountDataHooks";
import { mockSecretKeyAccount } from "../../mocks/factories";
import { renderHook } from "../../mocks/testUtils";
import { accountsSlice } from "../redux/slices/accountsSlice";
import { store } from "../redux/store";

describe("useRemoveAccount", () => {
  test("deletes relevant data from accounts slice", () => {
    const account = mockSecretKeyAccount(0);
    store.dispatch(accountsSlice.actions.addAccount(account));
    store.dispatch(
      accountsSlice.actions.addSecretKey({
        pkh: account.address.pkh,
        encryptedSecretKey: "encryptedSecretKey" as any,
      })
    );

    const {
      result: { current: removeAccount },
    } = renderHook(() => useRemoveAccount());
    removeAccount(account);

    expect(store.getState().accounts.items).toEqual([]);
    expect(store.getState().accounts.secretKeys).toEqual({});
  });
});
