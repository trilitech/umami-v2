import { type MultisigAccount, mockContractContact, mockMnemonicAccount } from "@umami/core";
import { multisigsFixture } from "@umami/multisig";
import { MAINNET } from "@umami/tezos";

import { renameAccount } from "./renameAccount";
import { contactsActions } from "../slices/contacts";
import { networksActions } from "../slices/networks";
import { type UmamiStore, makeStore } from "../store";
import { addTestAccount } from "../testUtils";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
  [mockMnemonicAccount(0), mockMnemonicAccount(1), ...multisigsFixture].forEach(account =>
    addTestAccount(store, account)
  );
});

describe("renameAccount", () => {
  describe("validation", () => {
    it("does nothing for existing account name", () => {
      store.dispatch(renameAccount(mockMnemonicAccount(0), mockMnemonicAccount(1).label));

      expect(store.getState().accounts.items).toEqual([
        mockMnemonicAccount(0),
        mockMnemonicAccount(1),
      ]);
      expect(store.getState().multisigs.items).toEqual(
        multisigsFixture.map((multisig, i) => ({
          ...multisig,
          label: `Multisig Account ${i}`,
          type: "multisig",
        }))
      );
    });

    it("does nothing for existing contact name", () => {
      store.dispatch(
        contactsActions.upsert({ name: "contact name", pkh: "pkh", network: "undefined" })
      );

      store.dispatch(renameAccount(mockMnemonicAccount(0), "contact name"));

      expect(store.getState().accounts.items).toEqual([
        mockMnemonicAccount(0),
        mockMnemonicAccount(1),
      ]);
      expect(store.getState().multisigs.items).toEqual(
        multisigsFixture.map((multisig, i) => ({
          ...multisig,
          label: `Multisig Account ${i}`,
          type: "multisig",
        }))
      );
    });

    it("check contact names across all networks", () => {
      store.dispatch(networksActions.setCurrent(MAINNET));
      store.dispatch(contactsActions.upsert(mockContractContact(0, "ghostnet", "contact name")));

      store.dispatch(renameAccount(mockMnemonicAccount(0), "contact name"));

      expect(store.getState().accounts.items).toEqual([
        mockMnemonicAccount(0),
        mockMnemonicAccount(1),
      ]);
      expect(store.getState().multisigs.items).toEqual(
        multisigsFixture.map((multisig, i) => ({
          ...multisig,
          label: `Multisig Account ${i}`,
          type: "multisig",
        }))
      );
    });
  });

  describe("store", () => {
    it("updates implicit account name", () => {
      store.dispatch(renameAccount(mockMnemonicAccount(0), "new name"));

      expect(store.getState().accounts.items).toEqual([
        mockMnemonicAccount(0, { label: "new name" }),
        mockMnemonicAccount(1),
      ]);
    });

    it("updates multisig account name", () => {
      const multisigAccount: MultisigAccount = {
        ...multisigsFixture[0],
        label: `Multisig Account ${0}`,
        type: "multisig",
      };

      store.dispatch(renameAccount(multisigAccount, "new name"));

      expect(store.getState().multisigs.items).toEqual(
        multisigsFixture.map((multisig, i) => ({
          ...multisig,
          label: i === 0 ? "new name" : `Multisig Account ${i}`,
          type: "multisig",
        }))
      );
    });
  });
});
