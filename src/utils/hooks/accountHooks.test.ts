import { renderHook } from "@testing-library/react";
import {
  mockImplicitAccount,
  mockMultisigAccount,
  mockSocialOrLedgerAccount,
} from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import accountsSlice from "../redux/slices/accountsSlice";
import { assetsActions } from "../redux/slices/assetsSlice";
import multisigsSlice from "../redux/slices/multisigsSlice";
import store from "../redux/store";
import { useGetBestSignerForAccount, useIsOwnedAddress } from "./accountHooks";
import { AllTheProviders } from "../../mocks/testUtils";

describe("accountHooks", () => {
  describe("useGetBestSignerForAccount", () => {
    it("returns the account itself for implicit accounts", () => {
      const account = mockSocialOrLedgerAccount(0);

      store.dispatch(accountsSlice.actions.addNonMnemonicAccount([account]));

      const { result } = renderHook(() => useGetBestSignerForAccount(), { wrapper: ReduxStore });
      expect(result.current(account)).toEqual(account);
    });

    it("returns the signer with the biggest balance for multisig accounts", () => {
      const signers = [
        mockSocialOrLedgerAccount(0),
        mockSocialOrLedgerAccount(1),
        mockSocialOrLedgerAccount(2),
      ];
      const multisig = { ...mockMultisigAccount(0), signers: signers.map(s => s.address) };

      store.dispatch(accountsSlice.actions.addNonMnemonicAccount(signers));
      store.dispatch(multisigsSlice.actions.setMultisigs([multisig]));

      store.dispatch(
        assetsActions.updateTezBalance([
          { address: mockImplicitAccount(1).address.pkh, balance: 5 },
          { address: mockImplicitAccount(2).address.pkh, balance: 1 },
        ])
      );

      const { result } = renderHook(() => useGetBestSignerForAccount(), { wrapper: ReduxStore });
      expect(result.current(multisig)).toEqual(mockSocialOrLedgerAccount(1));
    });
  });

  test("useIsOwnedAddress", () => {
    store.dispatch(accountsSlice.actions.addNonMnemonicAccount([mockSocialOrLedgerAccount(0)]));

    let view = renderHook(() => useIsOwnedAddress(mockImplicitAccount(0).address.pkh), {
      wrapper: AllTheProviders,
    });
    expect(view.result.current).toEqual(true);

    view = renderHook(() => useIsOwnedAddress(mockImplicitAccount(2).address.pkh), {
      wrapper: AllTheProviders,
    });

    expect(view.result.current).toEqual(false);
  });
});
