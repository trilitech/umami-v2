import { multisigs } from "../../../mocks/multisig";
import store from "../store";
import { mockMnemonicAccount, mockMultisigAccount } from "../../../mocks/factories";
import { multisigActions } from "../slices/multisigsSlice";
import renameAccount from "./renameAccount";
import accountsSlice from "../slices/accountsSlice";
import { AccountType, MultisigAccount } from "../../../types/Account";

beforeEach(() => {
  store.dispatch(multisigActions.setMultisigs(multisigs));
  store.dispatch(
    accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0), mockMnemonicAccount(1)])
  );
});

describe("renameAccount", () => {
  describe("validation", () => {
    it("does nothing for non existent account", () => {
      store.dispatch(renameAccount(mockMnemonicAccount(2), "new name"));
      expect(store.getState().accounts.items).toEqual([
        mockMnemonicAccount(0),
        mockMnemonicAccount(1),
      ]);

      expect(store.getState().multisigs.items).toEqual(
        multisigs.map((m, i) => ({
          ...m,
          label: `Multisig Account ${i}`,
          type: AccountType.MULTISIG,
        }))
      );
    });

    it("does nothing for existing name", () => {
      store.dispatch(renameAccount(mockMnemonicAccount(0), mockMnemonicAccount(1).label));
      expect(store.getState().accounts.items).toEqual([
        mockMnemonicAccount(0),
        mockMnemonicAccount(1),
      ]);

      expect(store.getState().multisigs.items).toEqual(
        multisigs.map((m, i) => ({
          ...m,
          label: `Multisig Account ${i}`,
          type: AccountType.MULTISIG,
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
        type: AccountType.MULTISIG,
      };
      store.dispatch(renameAccount(multisigAccount, "new name"));

      expect(store.getState().multisigs.items).toEqual(
        multisigs.map((m, i) => ({
          ...m,
          label: i === 0 ? "new name" : `Multisig Account ${i}`,
          type: AccountType.MULTISIG,
        }))
      );
    });
  });
});
