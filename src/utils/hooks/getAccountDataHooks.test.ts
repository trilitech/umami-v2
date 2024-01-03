import { renderHook } from "@testing-library/react";

import {
  useGetBestSignerForAccount,
  useGetNextAvailableAccountLabels,
  useIsOwnedAddress,
  useIsUniqueLabel,
} from "./getAccountDataHooks";
import {
  mockContact,
  mockImplicitAccount,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../mocks/factories";
import { AllTheProviders } from "../../mocks/testUtils";
import { ReduxStore } from "../../providers/ReduxStore";
import { accountsSlice } from "../redux/slices/accountsSlice";
import { assetsActions } from "../redux/slices/assetsSlice";
import { contactsActions } from "../redux/slices/contactsSlice";
import { multisigActions, multisigsSlice } from "../redux/slices/multisigsSlice";
import { store } from "../redux/store";
import { checkAccountsAndUpsertContact } from "../redux/thunks/checkAccountsAndUpsertContact";
import { renameAccount } from "../redux/thunks/renameAccount";

describe("getAccountDataHooks", () => {
  describe("useGetBestSignerForAccount", () => {
    it("returns the account itself for implicit accounts", () => {
      const account = mockMnemonicAccount(0);

      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));

      const { result } = renderHook(() => useGetBestSignerForAccount(), { wrapper: ReduxStore });
      expect(result.current(account)).toEqual(account);
    });

    it("returns the signer with the biggest balance for multisig accounts", () => {
      const signers = [mockMnemonicAccount(0), mockMnemonicAccount(1), mockMnemonicAccount(2)];
      const multisig = { ...mockMultisigAccount(0), signers: signers.map(s => s.address) };

      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts(signers));
      store.dispatch(multisigsSlice.actions.setMultisigs([multisig]));

      store.dispatch(
        assetsActions.updateTezBalance([
          { address: mockImplicitAccount(1).address.pkh, balance: 5 },
          { address: mockImplicitAccount(2).address.pkh, balance: 1 },
        ])
      );

      const { result } = renderHook(() => useGetBestSignerForAccount(), { wrapper: ReduxStore });
      expect(result.current(multisig)).toEqual(mockImplicitAccount(1));
    });
  });

  describe("useIsUniqueLabel", () => {
    const testCase = [
      { testLabel: "Unique Label", expected: true },
      { testLabel: "Ledger Account Label", expected: false },
      { testLabel: "Social Account Label", expected: false },
      { testLabel: "Secret Key Account Label", expected: false },
      { testLabel: "Mnemonic Account Label", expected: false },
      { testLabel: "Multisig Account Label", expected: false },
      { testLabel: "Contact Label", expected: false },
    ];

    describe.each(testCase)("For $testLabel", testCase => {
      it(`returns ${testCase.expected}`, () => {
        store.dispatch(
          accountsSlice.actions.addAccount(mockLedgerAccount(0, "Ledger Account Label"))
        );
        store.dispatch(
          accountsSlice.actions.addAccount(mockSocialAccount(1, "Social Account Label"))
        );
        store.dispatch(
          accountsSlice.actions.addAccount(mockSecretKeyAccount(2, "Secret Key Account Label"))
        );
        store.dispatch(
          accountsSlice.actions.addMockMnemonicAccounts([
            mockMnemonicAccount(3, "Mnemonic Account Label"),
          ])
        );
        store.dispatch(multisigsSlice.actions.setMultisigs([mockMultisigAccount(4)]));
        store.dispatch(renameAccount(mockMultisigAccount(5), "Multisig Account Label"));
        store.dispatch(contactsActions.upsert({ name: "Contact Label", pkh: "pkh1" }));

        const { result } = renderHook(() => useIsUniqueLabel(), { wrapper: ReduxStore });

        expect(result.current(testCase.testLabel)).toEqual(testCase.expected);
      });
    });
  });

  describe("useGetNextAvailableAccountLabels", () => {
    const existingAccounts = [
      {
        type: "ledger" as const,
        accounts: [mockLedgerAccount(0, "Test acc 2"), mockLedgerAccount(1, "Test acc 4")],
      },
      {
        type: "social" as const,
        accounts: [mockSocialAccount(0, "Test acc 2"), mockSocialAccount(1, "Test acc 4")],
      },
      {
        type: "mnemonic" as const,
        accounts: [mockMnemonicAccount(0, "Test acc 2"), mockMnemonicAccount(1, "Test acc 4")],
      },
      {
        type: "secret_key" as const,
        accounts: [mockSecretKeyAccount(0, "Test acc 2"), mockSecretKeyAccount(1, "Test acc 4")],
      },
    ];
    describe.each(existingAccounts)("among $type accounts", existingAccounts => {
      it("returns unique labels", async () => {
        if (existingAccounts.type === "mnemonic") {
          store.dispatch(accountsSlice.actions.addMockMnemonicAccounts(existingAccounts.accounts));
        } else {
          existingAccounts.accounts.forEach(account =>
            store.dispatch(accountsSlice.actions.addAccount(account))
          );
        }

        const {
          result: { current: getNextAvailableLabels },
        } = renderHook(() => useGetNextAvailableAccountLabels(), {
          wrapper: ReduxStore,
        });

        expect(getNextAvailableLabels("Test acc", 4)).toEqual([
          "Test acc",
          "Test acc 3",
          "Test acc 5",
          "Test acc 6",
        ]);
      });
    });

    it("among multisig accounts returns unique labels", async () => {
      store.dispatch(
        multisigActions.setMultisigs([mockMultisigAccount(0), mockMultisigAccount(1)])
      );
      store.dispatch(renameAccount(mockMultisigAccount(0), "Test acc 2"));
      store.dispatch(renameAccount(mockMultisigAccount(1), "Test acc 4"));

      const {
        result: { current: getNextAvailableLabels },
      } = renderHook(() => useGetNextAvailableAccountLabels(), {
        wrapper: ReduxStore,
      });

      expect(getNextAvailableLabels("Test acc", 4)).toEqual([
        "Test acc",
        "Test acc 3",
        "Test acc 5",
        "Test acc 6",
      ]);
    });

    it("among contacts returns unique labels", async () => {
      store.dispatch(checkAccountsAndUpsertContact(mockContact(0, "Test acc 2")));
      store.dispatch(checkAccountsAndUpsertContact(mockContact(1, "Test acc 4")));

      const {
        result: { current: getNextAvailableLabels },
      } = renderHook(() => useGetNextAvailableAccountLabels(), {
        wrapper: ReduxStore,
      });

      expect(getNextAvailableLabels("Test acc", 4)).toEqual([
        "Test acc",
        "Test acc 3",
        "Test acc 5",
        "Test acc 6",
      ]);
    });
  });

  test("useIsOwnedAddress", () => {
    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));

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
