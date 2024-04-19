import { accountsActions } from "./accountsSlice";
import {
  mockImplicitAccount,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { MnemonicAccount } from "../../../types/Account";
import { store } from "../store";

describe("accountsSlice", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().accounts).toEqual({
      items: [],
      seedPhrases: {},
      secretKeys: {},
    });
  });

  describe("removeMnemonicAndAccounts", () => {
    it("deletes seedphrases and all derived accounts", () => {
      store.dispatch(
        accountsActions.addMnemonicAccounts({
          seedFingerprint: "mockPrint1",
          accounts: [
            mockImplicitAccount(1, undefined, "mockPrint1") as MnemonicAccount,
            mockImplicitAccount(3, undefined, "mockPrint1") as MnemonicAccount,
          ],
          encryptedMnemonic: {} as any,
        })
      );

      store.dispatch(
        accountsActions.addMnemonicAccounts({
          seedFingerprint: "mockPrint2",
          accounts: [mockImplicitAccount(2, undefined, "mockPrint2") as MnemonicAccount],
          encryptedMnemonic: {} as any,
        })
      );

      expect(store.getState().accounts).toEqual({
        items: [
          mockImplicitAccount(1, undefined, "mockPrint1"),
          mockImplicitAccount(3, undefined, "mockPrint1"),
          mockImplicitAccount(2, undefined, "mockPrint2"),
        ],
        seedPhrases: { mockPrint1: {}, mockPrint2: {} },
        secretKeys: {},
      });

      store.dispatch(accountsActions.removeMnemonicAndAccounts({ fingerPrint: "mockPrint1" }));

      expect(store.getState().accounts).toEqual({
        items: [mockImplicitAccount(2, undefined, "mockPrint2")],
        seedPhrases: { mockPrint2: {} },
        secretKeys: {},
      });
    });
  });

  describe("removeNonMnemonicAccounts", () => {
    const mnemonic = mockMnemonicAccount(0);
    const social1 = mockSocialAccount(1);
    const social2 = mockSocialAccount(2);
    const ledger = mockLedgerAccount(3);
    const secretKey1 = mockSecretKeyAccount(4);
    const secretKey2 = mockSecretKeyAccount(5);

    beforeEach(() => {
      addAccount(mnemonic);
      addAccount(social1);
      addAccount(social2);
      addAccount(ledger);
      addAccount(secretKey1);
      addAccount(secretKey2);
      store.dispatch(
        accountsActions.addSecretKey({
          pkh: secretKey1.address.pkh,
          encryptedSecretKey: "encryptedSecretKey1" as any,
        })
      );
      store.dispatch(
        accountsActions.addSecretKey({
          pkh: secretKey2.address.pkh,
          encryptedSecretKey: "encryptedSecretKey2" as any,
        })
      );
    });

    it("does nothing for mnemonic account", () => {
      store.dispatch(
        accountsActions.removeNonMnemonicAccounts({
          accountType: "mnemonic",
        })
      );
      expect(store.getState().accounts.items).toHaveLength(6);
      expect(Object.keys(store.getState().accounts.secretKeys)).toHaveLength(2);
    });

    it("should remove ledger account", () => {
      store.dispatch(
        accountsActions.removeNonMnemonicAccounts({
          accountType: "ledger",
        })
      );
      expect(store.getState().accounts.items).toEqual([
        mnemonic,
        social1,
        social2,
        secretKey1,
        secretKey2,
      ]);
      expect(Object.keys(store.getState().accounts.secretKeys)).toHaveLength(2);
    });

    it("removes multiple secret key accounts & stored secret keys", () => {
      store.dispatch(
        accountsActions.removeNonMnemonicAccounts({
          accountType: "secret_key",
        })
      );
      expect(store.getState().accounts.items).toEqual([mnemonic, social1, social2, ledger]);
      expect(store.getState().accounts.secretKeys).toEqual({});
    });

    it("should remove multiple social accounts", () => {
      store.dispatch(
        accountsActions.removeNonMnemonicAccounts({
          accountType: "social",
        })
      );
      expect(store.getState().accounts.items).toEqual([mnemonic, ledger, secretKey1, secretKey2]);
      expect(Object.keys(store.getState().accounts.secretKeys)).toHaveLength(2);
    });
  });

  describe("removeAccount", () => {
    const mnemonic = mockMnemonicAccount(0);
    const social1 = mockSocialAccount(1);
    const social2 = mockSocialAccount(2);
    const ledger = mockLedgerAccount(3);
    const secretKey = mockSecretKeyAccount(4);

    beforeEach(() => {
      addAccount(mnemonic);
      addAccount(social1);
      addAccount(social2);
      addAccount(ledger);
      addAccount(secretKey);
    });

    const accounts = [social1, social2, ledger, secretKey];

    it.each(accounts)("removes $type account", account => {
      store.dispatch(accountsActions.removeAccount(account));

      const remainingAccounts = accounts.filter(acc => acc.address.pkh !== account.address.pkh);
      expect(store.getState().accounts.items).toEqual([mnemonic, ...remainingAccounts]);
    });

    it("removes secret key on removing secret key account", () => {
      const secretKeyAccount2 = mockSecretKeyAccount(5);
      store.dispatch(
        accountsActions.addSecretKey({
          pkh: secretKey.address.pkh,
          encryptedSecretKey: "encryptedSecretKey" as any,
        })
      );
      store.dispatch(
        accountsActions.addSecretKey({
          pkh: secretKeyAccount2.address.pkh,
          encryptedSecretKey: "encryptedSecretKey2" as any,
        })
      );

      store.dispatch(accountsActions.removeAccount(secretKey));

      expect(store.getState().accounts.items).toEqual([mnemonic, social1, social2, ledger]);
      expect(store.getState().accounts.secretKeys).toEqual({
        [secretKeyAccount2.address.pkh]: "encryptedSecretKey2",
      });
    });
  });

  describe("addMnemonicAccounts", () => {
    it("adds mnemonic accounts & encrypted seedphrase to storage", () => {
      const seedFingerprint = "mockPrint1";
      const mockEncrypted = { mock: "encrypted" };
      const restoredAccounts: MnemonicAccount[] = [
        mockImplicitAccount(1, undefined, "mockPrint1") as MnemonicAccount,
        mockImplicitAccount(3, undefined, "mockPrint1") as MnemonicAccount,
      ];

      store.dispatch(
        accountsActions.addMnemonicAccounts({
          seedFingerprint,
          accounts: restoredAccounts,
          encryptedMnemonic: mockEncrypted as any,
        })
      );

      expect(store.getState().accounts.items).toEqual(restoredAccounts);
      expect(store.getState().accounts.seedPhrases).toEqual({
        [seedFingerprint]: mockEncrypted,
      });
    });
  });

  describe("rename account", () => {
    const mnemonic1 = mockMnemonicAccount(1);
    const mnemonic2 = mockMnemonicAccount(2);
    const social = mockSocialAccount(3);
    const ledger = mockLedgerAccount(4);

    beforeEach(() => {
      addAccount(mnemonic1);
      addAccount(mnemonic2);
      addAccount(social);
      addAccount(ledger);
    });

    it("throws when the new name is empty", () => {
      expect(() =>
        store.dispatch(accountsActions.renameAccount({ account: mnemonic1, newName: "" }))
      ).toThrow("Cannot rename account to an empty name.");
    });

    it("throws when the new name is used by other implicit account", () => {
      expect(() =>
        store.dispatch(accountsActions.renameAccount({ account: mnemonic1, newName: social.label }))
      ).toThrow(
        "Cannot rename account tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf to Account 4 since the name already exists."
      );
    });

    it("doesn't do anything for non existing account", () => {
      expect(store.getState().accounts.items).toEqual([mnemonic1, mnemonic2, social, ledger]);
      store.dispatch(
        accountsActions.renameAccount({
          account: { ...mnemonic1, label: "non existing account" },
          newName: "new name",
        })
      );
      expect(store.getState().accounts.items).toEqual([mnemonic1, mnemonic2, social, ledger]);
    });

    it("renames mnemonic account", () => {
      store.dispatch(
        accountsActions.renameAccount({ account: mnemonic2, newName: "new mnemonic2 label" })
      );
      expect(
        store.getState().accounts.items.find(account => account.label === mnemonic2.label)
      ).toBeUndefined();
      expect(
        store.getState().accounts.items.find(account => account.label === "new mnemonic2 label")
      ).toEqual({ ...mnemonic2, label: "new mnemonic2 label" });
    });

    it("renames social account", () => {
      store.dispatch(
        accountsActions.renameAccount({ account: social, newName: "new social label" })
      );
      expect(
        store.getState().accounts.items.find(account => account.label === social.label)
      ).toBeUndefined();
      expect(
        store.getState().accounts.items.find(account => account.label === "new social label")
      ).toEqual({ ...social, label: "new social label" });
    });

    it("renames ledger account", () => {
      store.dispatch(
        accountsActions.renameAccount({ account: ledger, newName: "new ledger label" })
      );
      expect(
        store.getState().accounts.items.find(account => account.label === ledger.label)
      ).toBeUndefined();
      expect(
        store.getState().accounts.items.find(account => account.label === "new ledger label")
      ).toEqual({ ...ledger, label: "new ledger label" });
    });
  });
});
