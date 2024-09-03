import {
  type ImplicitAccount,
  type MnemonicAccount,
  mockImplicitAccount,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
  rawAccountFixture,
} from "@umami/core";
import { encryptedMnemonic1 } from "@umami/test-utils";

import {
  useCurrentAccount,
  useGetAccountsByFingerPrint,
  useGetAccountsByType,
  useGetBestSignerForAccount,
  useIsOwnedAddress,
  useValidateMasterPassword,
} from "./getAccountData";
import { accountsActions, assetsActions, multisigsActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import { act, addTestAccount, addTestAccounts, renderHook, waitFor } from "../testUtils";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("getAccountDataHooks", () => {
  describe("useGetAccountsByType", () => {
    const accounts = [
      mockMnemonicAccount(0),
      mockMnemonicAccount(1),
      mockSocialAccount(2),
      mockSocialAccount(3),
      mockLedgerAccount(4),
      mockLedgerAccount(5),
      mockSecretKeyAccount(6),
      mockSecretKeyAccount(7),
    ];
    const accountTypes: ImplicitAccount["type"][] = ["mnemonic", "social", "ledger", "secret_key"];

    beforeEach(() => addTestAccounts(store, accounts));

    it.each(accountTypes)("returns all accounts of given type %s", type => {
      const {
        result: { current: getAccountsByType },
      } = renderHook(() => useGetAccountsByType(), { store });

      expect(getAccountsByType(type)).toHaveLength(2);
      expect(getAccountsByType(type)).toEqual(accounts.filter(account => account.type === type));
    });
  });

  describe("useGetAccountsByFingerPrint", () => {
    beforeEach(() => {
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
    });

    it("returns empty list if no accounts match fingerprint", () => {
      const {
        result: { current: getAccountsByFingerPrint },
      } = renderHook(() => useGetAccountsByFingerPrint(), { store });

      expect(getAccountsByFingerPrint("mockPrint3")).toEqual([]);
    });

    it("returns accounts that match fingerprint", () => {
      const {
        result: { current: getAccountsByFingerPrint },
      } = renderHook(() => useGetAccountsByFingerPrint(), { store });

      expect(getAccountsByFingerPrint("mockPrint1")).toEqual([
        mockImplicitAccount(1, undefined, "mockPrint1") as MnemonicAccount,
        mockImplicitAccount(3, undefined, "mockPrint1") as MnemonicAccount,
      ]);
    });
  });

  describe("useGetBestSignerForAccount", () => {
    it("returns the account itself for implicit accounts", () => {
      const account = mockMnemonicAccount(0);

      addTestAccount(store, account);

      const { result } = renderHook(() => useGetBestSignerForAccount(), { store });
      expect(result.current(account)).toEqual(account);
    });

    it("returns the signer with the biggest balance for multisig accounts", () => {
      const signers = [mockMnemonicAccount(0), mockMnemonicAccount(1), mockMnemonicAccount(2)];
      const multisig = { ...mockMultisigAccount(0), signers: signers.map(s => s.address) };

      console.log(signers);

      addTestAccounts(store, signers);
      store.dispatch(multisigsActions.setMultisigs([multisig]));

      store.dispatch(
        assetsActions.updateAccountStates([
          rawAccountFixture({
            address: mockImplicitAccount(1).address.pkh,
            balance: 5,
          }),
          rawAccountFixture({
            address: mockImplicitAccount(2).address.pkh,
            balance: 1,
          }),
        ])
      );

      const { result } = renderHook(() => useGetBestSignerForAccount(), { store });
      expect(result.current(multisig)).toEqual(mockImplicitAccount(1));
    });
  });

  describe("useIsOwnedAddress", () => {
    beforeEach(() => addTestAccount(store, mockMnemonicAccount(0)));

    it("returns true if account is owned", () => {
      const view = renderHook(() => useIsOwnedAddress(), { store });

      expect(view.result.current(mockImplicitAccount(0).address.pkh)).toEqual(true);
    });

    it("returns false if account is not owned", () => {
      const view = renderHook(() => useIsOwnedAddress(), { store });

      expect(view.result.current(mockImplicitAccount(2).address.pkh)).toEqual(false);
    });
  });

  describe("useValidateMasterPassword", () => {
    it("returns null if no accounts exist", () => {
      const {
        result: { current: result },
      } = renderHook(() => useValidateMasterPassword(), { store });

      expect(result).toEqual(null);
    });

    it("returns null if only social account exists", () => {
      addTestAccount(store, mockSocialAccount(0));
      const {
        result: { current: result },
      } = renderHook(() => useValidateMasterPassword(), { store });

      expect(result).toEqual(null);
    });

    it("returns null if only ledger account exists", () => {
      addTestAccount(store, mockLedgerAccount(0));
      const {
        result: { current: result },
      } = renderHook(() => useValidateMasterPassword(), { store });

      expect(result).toEqual(null);
    });

    it("returns a validation function if mnemonic account exists", async () => {
      store.dispatch(
        accountsActions.addMnemonicAccounts({
          seedFingerprint: "print",
          accounts: [],
          encryptedMnemonic: encryptedMnemonic1,
        })
      );
      const {
        result: { current: result },
      } = renderHook(() => useValidateMasterPassword(), { store });

      await waitFor(async () => expect(await result!("123123123")).toEqual(undefined));
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
      } = renderHook(() => useValidateMasterPassword(), { store });

      expect(await result!("123123123")).toEqual(undefined);
      await expect(result!("wrong password")).rejects.toThrow(
        "Error decrypting data: Invalid password"
      );
    });
  });

  describe("useCurrentAccount", () => {
    const account = mockMnemonicAccount(0);

    it("returns undefined if current account is not set", () => {
      const {
        result: { current: currentAccount },
      } = renderHook(() => useCurrentAccount(), { store });

      expect(currentAccount).toBeUndefined();
    });

    it("returns undefined if current account does not exist", () => {
      store.dispatch(accountsActions.setCurrent(account.address.pkh));
      const {
        result: { current: currentAccount },
      } = renderHook(() => useCurrentAccount(), { store });

      expect(currentAccount).toBeUndefined();
    });

    it("returns the current account if it exists", () => {
      addTestAccount(store, account);
      store.dispatch(accountsActions.setCurrent(account.address.pkh));

      const {
        result: { current: currentAccount },
      } = renderHook(() => useCurrentAccount(), { store });

      expect(currentAccount).toEqual(account);
    });

    it("sets the current account to the first available one if it went out of sync", async () => {
      addTestAccount(store, account);
      const anotherAccount = mockSocialAccount(1);
      addTestAccount(store, anotherAccount);

      store.dispatch(accountsActions.setCurrent(anotherAccount.address.pkh));

      const { result } = renderHook(() => useCurrentAccount(), { store });

      expect(result.current).toEqual(anotherAccount);

      await act(() => store.dispatch(accountsActions.removeAccount(anotherAccount)));

      expect(result.current).toEqual(account);
    });

    it("sets the current account undefined if last account was removed", async () => {
      const account = mockSocialAccount(1);
      addTestAccount(store, account);

      store.dispatch(accountsActions.setCurrent(account.address.pkh));

      const { result } = renderHook(() => useCurrentAccount(), { store });

      expect(result.current).toEqual(account);

      await act(() => store.dispatch(accountsActions.removeAccount(account)));

      expect(result.current).toBeUndefined();
    });
  });
});
