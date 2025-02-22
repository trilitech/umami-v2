import {
  mockContractContact,
  mockImplicitContact,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "@umami/core";
import { MAINNET } from "@umami/tezos";

import { PROHIBITED_CHARACTERS, useGetNextAvailableAccountLabels, useValidateName } from "./labels";
import { contactsActions, multisigsActions, networksActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import { addTestAccounts, renderHook } from "../testUtils";
import { renameAccount } from "../thunks";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("labelsHooks", () => {
  describe("useValidateName", () => {
    it.each(PROHIBITED_CHARACTERS)("fails if name contains `%s` special character", char => {
      const {
        result: { current: validateName },
      } = renderHook(() => useValidateName(), { store });

      expect(validateName(`Some ${char} name`)).toEqual("Name contains special character(s)");
    });

    it("fails if name exceeds 256 characters", () => {
      const {
        result: { current: validateName },
      } = renderHook(() => useValidateName(), { store });

      expect(validateName("a".repeat(257))).toEqual("Name should not exceed 256 characters");
    });

    describe.each([
      { testCase: "with trailing whitespaces", withWhitespaces: true },
      { testCase: "without trailing whitespaces", withWhitespaces: false },
    ])("$testCase", ({ withWhitespaces }) => {
      const untrimName = (name: string) => (withWhitespaces ? `\t  ${name}\t  ` : name);

      it("returns true if the name is valid", () => {
        const {
          result: { current: validateName },
        } = renderHook(() => useValidateName(), { store });

        expect(validateName(untrimName("Valid Name"))).toEqual(true);
      });

      it("fails for empty name", () => {
        const {
          result: { current: validateName },
        } = renderHook(() => useValidateName(), { store });

        expect(validateName(untrimName(""))).toEqual("Name should not be empty");
      });

      it("fails for unchanged name", () => {
        const {
          result: { current: validateName },
        } = renderHook(() => useValidateName("Unchanged Name"), { store });

        expect(validateName(untrimName("Unchanged Name"))).toEqual("Name was not changed");
      });

      it.each([
        "Ledger Account Label",
        "Social Account Label",
        "Secret Key Account Label",
        "Mnemonic Account Label",
        "Multisig Account Label",
        "Implicit Contact Label",
        "Contract Contact Label",
      ])("fails on reusing %s", takenName => {
        addTestAccounts(store, [
          mockLedgerAccount(0, "Ledger Account Label"),
          mockSocialAccount(1, "Social Account Label"),
          mockSecretKeyAccount(2, "Secret Key Account Label"),
          mockMnemonicAccount(3, { label: "Mnemonic Account Label" }),
        ]);
        store.dispatch(multisigsActions.setMultisigs([mockMultisigAccount(4)]));
        store.dispatch(renameAccount(mockMultisigAccount(5), "Multisig Account Label"));
        store.dispatch(
          contactsActions.upsert({
            name: "Implicit Contact Label",
            pkh: "pkh1",
            network: "undefined",
          })
        );
        store.dispatch(
          contactsActions.upsert({
            name: "Contract Contact Label",
            pkh: "pkh2",
            network: "ghostnet",
          })
        );
        store.dispatch(networksActions.setCurrent(MAINNET));

        const {
          result: { current: validateName },
        } = renderHook(() => useValidateName(), { store });

        expect(validateName(untrimName(takenName))).toEqual(
          "Name must be unique across all accounts and contacts"
        );
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
        accounts: [
          mockMnemonicAccount(0, { label: "Test acc 2" }),
          mockMnemonicAccount(1, { label: "Test acc 4" }),
        ],
      },
      {
        type: "secret_key" as const,
        accounts: [mockSecretKeyAccount(0, "Test acc 2"), mockSecretKeyAccount(1, "Test acc 4")],
      },
    ];

    describe.each(existingAccounts)("among $type accounts", existingAccounts => {
      it("returns unique labels", () => {
        addTestAccounts(store, existingAccounts.accounts);

        const {
          result: { current: getNextAvailableLabels },
        } = renderHook(() => useGetNextAvailableAccountLabels(), { store });

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
        multisigsActions.setMultisigs([mockMultisigAccount(0), mockMultisigAccount(1)])
      );
      store.dispatch(renameAccount(mockMultisigAccount(0), "Test acc 2"));
      store.dispatch(renameAccount(mockMultisigAccount(1), "Test acc 4"));

      const {
        result: { current: getNextAvailableLabels },
      } = renderHook(() => useGetNextAvailableAccountLabels(), { store });

      expect(getNextAvailableLabels("Test acc", 4)).toEqual([
        "Test acc",
        "Test acc 3",
        "Test acc 5",
        "Test acc 6",
      ]);
    });

    it("among all contacts returns unique labels", () => {
      store.dispatch(contactsActions.upsert(mockContractContact(0, "mainnet", "Test acc 2")));
      store.dispatch(contactsActions.upsert(mockContractContact(1, "ghostnet", "Test acc 4")));
      store.dispatch(contactsActions.upsert(mockImplicitContact(2, "Test acc 5")));

      const {
        result: { current: getNextAvailableLabels },
      } = renderHook(() => useGetNextAvailableAccountLabels(), { store });

      expect(getNextAvailableLabels("Test acc", 4)).toEqual([
        "Test acc",
        "Test acc 3",
        "Test acc 6",
        "Test acc 7",
      ]);
    });
  });
});
