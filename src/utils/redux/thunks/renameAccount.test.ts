import { multisigs } from "../../../mocks/multisig";
import store from "../store";
import { mockMnemonicAccount } from "../../../mocks/factories";
import { multisigActions } from "../slices/multisigsSlice";
import renameAccount from "./renameAccount";
import accountsSlice from "../slices/accountsSlice";
import { MultisigAccount } from "../../../types/Account";
import { contactsActions } from "../slices/contactsSlice";

beforeEach(() => {
  store.dispatch(multisigActions.setMultisigs(multisigs));
  store.dispatch(
    accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0), mockMnemonicAccount(1)])
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
        multisigs.map((m, i) => ({
          ...m,
          label: `Multisig Account ${i}`,
          type: "multisig",
        }))
      );
    });

    it("does nothing for existing contact name", () => {
      store.dispatch(contactsActions.upsert({ name: "contact name", pkh: "pkh" }));
      store.dispatch(renameAccount(mockMnemonicAccount(0), "contact name"));
      expect(store.getState().accounts.items).toEqual([
        mockMnemonicAccount(0),
        mockMnemonicAccount(1),
      ]);

      expect(store.getState().multisigs.items).toEqual(
        multisigs.map((m, i) => ({
          ...m,
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
        { ...mockMnemonicAccount(0), label: "new name" },
        mockMnemonicAccount(1),
      ]);
    });

    it("updates multisig account name", () => {
      const multisigAccount: MultisigAccount = {
        ...multisigs[0],
        label: `Multisig Account ${0}`,
        type: "multisig",
      };
      store.dispatch(renameAccount(multisigAccount, "new name"));

      expect(store.getState().multisigs.items).toEqual(
        multisigs.map((m, i) => ({
          ...m,
          label: i === 0 ? "new name" : `Multisig Account ${i}`,
          type: "multisig",
        }))
      );
    });
  });
});
