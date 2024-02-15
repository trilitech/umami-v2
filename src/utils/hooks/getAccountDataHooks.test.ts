import { renderHook } from "@testing-library/react";

import {
  useGetBestSignerForAccount,
  useGetNextAvailableAccountLabels,
  useIsOwnedAddress,
  useIsUniqueLabel,
  useValidateMasterPassword,
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
import { addAccount } from "../../mocks/helpers";
import { AllTheProviders } from "../../mocks/testUtils";
import { ReduxStore } from "../../providers/ReduxStore";
import { accountsActions, accountsSlice } from "../redux/slices/accountsSlice";
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
      it("returns unique labels", () => {
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

    it("among multisig accounts returns unique labels", () => {
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

    it("among contacts returns unique labels", () => {
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

  describe("useValidateMasterPassword", () => {
    it("returns null if no accounts exist", () => {
      const {
        result: { current: result },
      } = renderHook(() => useValidateMasterPassword(), { wrapper: ReduxStore });

      expect(result).toEqual(null);
    });

    it("returns null if only social account exists", () => {
      addAccount(mockSocialAccount(0));
      const {
        result: { current: result },
      } = renderHook(() => useValidateMasterPassword(), { wrapper: ReduxStore });

      expect(result).toEqual(null);
    });

    it("returns null if only ledger account exists", () => {
      addAccount(mockLedgerAccount(0));
      const {
        result: { current: result },
      } = renderHook(() => useValidateMasterPassword(), { wrapper: ReduxStore });

      expect(result).toEqual(null);
    });

    it("returns a validation function if mnemonic account exists", async () => {
      store.dispatch(
        accountsActions.addMnemonicAccounts({
          seedFingerprint: "print",
          accounts: [],
          encryptedMnemonic: {
            iv: "9c70b0a3f7aeefd5d73208f0",
            salt: "4f571e4cfa08d48bd324a0905d964696b715eb23a6845aad499531d4619a89f3",
            data: "135032f8496ab47cde9df5ea8592ef1058f82a5685fa6a5f9f0431216dedb52533cad4cf62c487eb7422273e3b28622207fd60cc61578f5d808e79113a88fee1ceba1f716bd7405cfc3436e9679fd1bdfa7fd2db7024f0ca65d7c6cc99f7a50f6fe7ecccb801382ffee890e631d6e674bafd12eec8788f332c3c2a3381bc932046ea3f980c0ed6fb85e70560baf5788b4857dd9b1c44240b9b16f8e794a6cbcc2d8de26bbfbd03cc",
          },
        })
      );
      const {
        result: { current: result },
      } = renderHook(() => useValidateMasterPassword(), { wrapper: ReduxStore });

      expect(await result!("123123123")).toEqual(undefined);
      await expect(result!("wrong password")).rejects.toThrow(
        "Error decrypting data: Invalid password"
      );
    });

    it("returns a validation function if secret key account exists", async () => {
      store.dispatch(
        accountsActions.addSecretKey({
          pkh: "pkh",
          encryptedSecretKey: {
            iv: "0f8864b5a8a7d3a3cb08e48f",
            salt: "aeadfefe2dd85277827a4e36d9b7f1ba4eb4e4a21525e7380b871dec1628c132",
            data: "a1864d8ea65647f11ea9c6df78f0d0fa3609f7363eb6349b29775ab9187c23ba4e7c5dc4a56d8efb76b6d2653aa32196fe34c32ed55402048a75d8082c4868eadcad2a40cd10004833feb3aab9b56d5bb45fff18976f69260cafc6ccac1ea8186f7dc3bc014bdc2ccd72dc9c0e960c7abfde",
          },
        })
      );
      const {
        result: { current: result },
      } = renderHook(() => useValidateMasterPassword(), { wrapper: ReduxStore });

      expect(await result!("123123123")).toEqual(undefined);
      await expect(result!("wrong password")).rejects.toThrow(
        "Error decrypting data: Invalid password"
      );
    });
  });
});
