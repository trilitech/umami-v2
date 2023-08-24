import { mockImplicitAccount } from "../../../mocks/factories";
import { fakeExtraArguments } from "../../../mocks/fakeExtraArgument";
import { fakeRestoreFromMnemonic } from "../../../mocks/helpers";
import { makeDefaultDevSignerKeys } from "../../../mocks/devSignerKeys";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { ImplicitAccount, AccountType, MnemonicAccount } from "../../../types/Account";

import store from "../store";
import { deriveAccount, restoreFromMnemonic } from "../thunks/restoreMnemonicAccounts";
import { getFingerPrint } from "../../tezos";
import { parseImplicitPkh } from "../../../types/Address";
import accountsSlice from "./accountsSlice";

const {
  actions: { addAccount, removeMnemonicAndAccounts },
} = accountsSlice;

beforeEach(async () => {
  const { pk, pkh } = await makeDefaultDevSignerKeys(0);
  fakeExtraArguments.derivePublicKeyPair.mockResolvedValue({
    pk,
    pkh,
  });
  fakeExtraArguments.decrypt.mockResolvedValue("unencryptedFingerprint");
});

describe("Accounts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().accounts).toEqual({
      items: [],
      mnemonics: {},
    });
  });

  test("should handle adding accounts and arrays of accounts", () => {
    store.dispatch(addAccount([mockImplicitAccount(1)]));
    expect(store.getState().accounts).toEqual({
      items: [mockImplicitAccount(1)],
      mnemonics: {},
    });

    store.dispatch(addAccount([mockImplicitAccount(2), mockImplicitAccount(3)]));
    expect(store.getState().accounts).toEqual({
      items: [mockImplicitAccount(1), mockImplicitAccount(2), mockImplicitAccount(3)],
      mnemonics: {},
    });
  });

  test("adding account should throw and exception if it is a pkh duplicate and not modify state", () => {
    store.dispatch(
      addAccount([mockImplicitAccount(1), mockImplicitAccount(2), mockImplicitAccount(3)])
    );

    expect(() => store.dispatch(addAccount([mockImplicitAccount(2)]))).toThrowError(
      `Can't add account ${mockImplicitAccount(2).address.pkh} in store since it already exists.`
    );

    expect(store.getState().accounts).toEqual({
      items: [mockImplicitAccount(1), mockImplicitAccount(2), mockImplicitAccount(3)],
      mnemonics: {},
    });
  });

  it("should handle deleting mnemonics and all derived accounts", async () => {
    await store.dispatch(
      fakeRestoreFromMnemonic({
        seedFingerprint: "mockPrint1",
        accounts: [
          mockImplicitAccount(1, undefined, "mockPrint1"),
          mockImplicitAccount(3, undefined, "mockPrint1"),
        ] as MnemonicAccount[],
      })
    );

    await store.dispatch(
      fakeRestoreFromMnemonic({
        seedFingerprint: "mockPrint2",
        accounts: [mockImplicitAccount(2, undefined, "mockPrint2")] as MnemonicAccount[],
      })
    );

    expect(store.getState().accounts).toEqual({
      items: [
        mockImplicitAccount(1, undefined, "mockPrint1"),
        mockImplicitAccount(3, undefined, "mockPrint1"),
        mockImplicitAccount(2, undefined, "mockPrint2"),
      ],
      mnemonics: { mockPrint1: {}, mockPrint2: {} },
    });

    store.dispatch(removeMnemonicAndAccounts({ fingerPrint: "mockPrint1" }));

    expect(store.getState().accounts).toEqual({
      items: [mockImplicitAccount(2, undefined, "mockPrint2")],
      mnemonics: { mockPrint2: {} },
    });
  });

  describe("restoreFromMnemonic thunk", () => {
    it("should restore accounts from mnemonic, encrypt mnemonic and store result in state", async () => {
      const fingerPrint = await getFingerPrint(mnemonic1);
      const mockEntrypted = { mock: "encrypted" };
      const mockLabel = "myLabel";
      const restoredAccounts: ImplicitAccount[] = [
        {
          ...mockImplicitAccount(0),
        },
        {
          ...mockImplicitAccount(1),
        },
      ];

      fakeExtraArguments.restoreRevealedMnemonicAccounts.mockResolvedValueOnce(
        restoredAccounts as MnemonicAccount[]
      );
      fakeExtraArguments.encrypt.mockResolvedValueOnce(mockEntrypted as any);

      await store
        .dispatch(
          restoreFromMnemonic({
            mnemonic: mnemonic1,
            password: "cool",
            label: mockLabel,
          })
        )
        .unwrap();

      expect(fakeExtraArguments.restoreRevealedMnemonicAccounts).toHaveBeenCalledWith(
        mnemonic1,
        mockLabel,
        undefined
      );
      expect(store.getState().accounts.items).toEqual(restoredAccounts);
      expect(store.getState().accounts.mnemonics).toEqual({
        [fingerPrint]: mockEntrypted,
      });
    });
  });

  describe("deriveAccount thunk", () => {
    it("should throw if we try to derive from an unknown mnemonic", async () => {
      await store.dispatch(
        fakeRestoreFromMnemonic({
          seedFingerprint: "mockPrint1",
          accounts: [mockImplicitAccount(1, undefined, "mockPrint1")] as MnemonicAccount[],
        })
      );

      let message = "";
      try {
        await store
          .dispatch(
            deriveAccount({
              fingerPrint: "unknown fingerprint",
              password: "bar",
              label: "cool",
            })
          )
          .unwrap();
      } catch (error: any) {
        message = error.message;
      }

      expect(message).toEqual("No mnemonic found with fingerprint:unknown fingerprint");
    });

    it("should derive and add an account after the last index", async () => {
      await store.dispatch(
        fakeRestoreFromMnemonic({
          seedFingerprint: "mockPrint1",
          accounts: [
            mockImplicitAccount(0, AccountType.MNEMONIC, "mockPrint1"),
            mockImplicitAccount(1, AccountType.MNEMONIC, "mockPrint1"),
          ] as MnemonicAccount[],
        })
      );

      await store
        .dispatch(
          deriveAccount({
            fingerPrint: "mockPrint1",
            password: "bar",
            label: "my new account",
          })
        )
        .unwrap();

      const expected = [
        {
          curve: "ed25519",
          derivationPath: "44'/1729'/0'/0'",
          derivationPathPattern: "44'/1729'/?'/0'",
          label: "Account 0",
          pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H0",
          address: parseImplicitPkh("tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h"),
          seedFingerPrint: "mockPrint1",
          type: "mnemonic",
        },
        {
          curve: "ed25519",
          derivationPath: "44'/1729'/1'/0'",
          derivationPathPattern: "44'/1729'/?'/0'",
          label: "Account 1",
          pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H1",
          address: parseImplicitPkh("tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"),
          seedFingerPrint: "mockPrint1",
          type: "mnemonic",
        },
        {
          curve: "ed25519",
          derivationPath: "44'/1729'/2'/0'",
          derivationPathPattern: "44'/1729'/?'/0'",
          label: "my new account",
          pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
          address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
          seedFingerPrint: "mockPrint1",
          type: "mnemonic",
        },
      ];
      expect(store.getState().accounts.items).toEqual(expected);
    });
  });
});
