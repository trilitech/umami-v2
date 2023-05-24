import { extraArgumentFake } from "../mocks/extraArgumentsFakes";
import { mockAccount } from "../mocks/factories";
import { fakeRestoreFromMnemonic } from "../mocks/helpers";
import { publicKeys1 } from "../mocks/publicKeys";
import { seedPhrase } from "../mocks/seedPhrase";
import { Account, AccountType, MnemonicAccount } from "../types/Account";
import accountsSlice from "./store/accountsSlice";

import { store } from "./store/store";
import {
  deriveAccount,
  restoreFromMnemonic,
} from "./store/thunks/restoreMnemonicAccounts";
import { getFingerPrint } from "./tezos";

const {
  actions: { add, reset, setSelected, removeSecret },
} = accountsSlice;

jest.mock("./aes");

afterEach(() => {
  store.dispatch(reset());
});

beforeEach(() => {
  extraArgumentFake.restoreAccount.mockResolvedValue({
    pk: publicKeys1.pk,
    pkh: publicKeys1.pkh,
  });
  extraArgumentFake.decrypt.mockResolvedValue("unencryptedFingerprint");
});

describe("Accounts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().accounts).toEqual({
      items: [],
      selected: null,
      seedPhrases: {},
    });
  });

  test("should handle adding accounts and arrays of accounts", () => {
    store.dispatch(add(mockAccount(1)));
    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1)],
      selected: null,
      seedPhrases: {},
    });

    store.dispatch(add([mockAccount(2), mockAccount(3)]));
    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
      seedPhrases: {},
    });
  });

  test("adding account should throw and exception if it is a pkh duplicate and not modify state", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));

    expect(() => store.dispatch(add(mockAccount(2)))).toThrowError(
      `Can't add account ${
        mockAccount(2).pkh
      } in store since it already exists.`
    );

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
      seedPhrases: {},
    });
  });

  test("should allow setting an existing account as selected", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(setSelected(mockAccount(2).pkh));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: mockAccount(2).pkh,
      seedPhrases: {},
    });
  });

  test("should ignore setting a non existing account as selected", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(setSelected(mockAccount(4).pkh));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
      seedPhrases: {},
    });
  });

  test("should allow settings selected account to null", () => {
    store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
    store.dispatch(setSelected(mockAccount(2).pkh));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: mockAccount(2).pkh,
      seedPhrases: {},
    });

    store.dispatch(setSelected(null));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(1), mockAccount(2), mockAccount(3)],
      selected: null,
      seedPhrases: {},
    });
  });

  it("should handle deleting seedphrases and all derived accounts", async () => {
    await store.dispatch(
      fakeRestoreFromMnemonic({
        seedFingerprint: "mockPrint1",
        accounts: [
          mockAccount(1, undefined, "mockPrint1"),
          mockAccount(3, undefined, "mockPrint1"),
        ] as MnemonicAccount[],
      })
    );

    await store.dispatch(
      fakeRestoreFromMnemonic({
        seedFingerprint: "mockPrint2",
        accounts: [
          mockAccount(2, undefined, "mockPrint2"),
        ] as MnemonicAccount[],
      })
    );

    expect(store.getState().accounts).toEqual({
      items: [
        mockAccount(1, undefined, "mockPrint1"),
        mockAccount(3, undefined, "mockPrint1"),
        mockAccount(2, undefined, "mockPrint2"),
      ],
      seedPhrases: { mockPrint1: {}, mockPrint2: {} },
      selected: null,
    });

    store.dispatch(removeSecret({ fingerPrint: "mockPrint1" }));

    expect(store.getState().accounts).toEqual({
      items: [mockAccount(2, undefined, "mockPrint2")],
      seedPhrases: { mockPrint2: {} },
      selected: null,
    });
  });

  describe("restoreFromMnemonic thunk", () => {
    it.only("should restore accounts from seedphrase, encrypt seedphrase and store result in state", async () => {
      const fingerPrint = await getFingerPrint(seedPhrase);
      const mockEntrypted = { mock: "encrypted" };
      const mockLabel = "myLabel";
      const restoredAccounts: Account[] = [
        {
          ...mockAccount(0),
        },
        {
          ...mockAccount(1),
        },
      ];

      extraArgumentFake.restoreMnemonicAccounts.mockResolvedValueOnce(
        restoredAccounts
      );
      extraArgumentFake.encryptMock.mockResolvedValueOnce(mockEntrypted);

      await store
        .dispatch(
          restoreFromMnemonic({
            seedPhrase: seedPhrase,
            password: "cool",
            label: mockLabel,
          })
        )
        .unwrap();

      expect(extraArgumentFake.restoreMnemonicAccounts).toHaveBeenCalledWith(
        seedPhrase,
        mockLabel,
        undefined
      );
      expect(store.getState().accounts.items).toEqual(restoredAccounts);
      expect(store.getState().accounts.seedPhrases).toEqual({
        [fingerPrint]: mockEntrypted,
      });
    });
  });

  describe("deriveAccount thunk", () => {
    it("should throw if we try to derive from an unknown seedphrase", async () => {
      await store.dispatch(
        fakeRestoreFromMnemonic({
          seedFingerprint: "mockPrint1",
          accounts: [
            mockAccount(1, undefined, "mockPrint1"),
          ] as MnemonicAccount[],
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

      expect(message).toEqual(
        "No seedphrase found with fingerprint:unknown fingerprint"
      );
    });

    it("should derive and add an account after the last index", async () => {
      await store.dispatch(
        fakeRestoreFromMnemonic({
          seedFingerprint: "mockPrint1",
          accounts: [
            mockAccount(0, AccountType.MNEMONIC, "mockPrint1"),
            mockAccount(1, AccountType.MNEMONIC, "mockPrint1"),
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
          derivationPath: "m/44'/1729'/0'/0'",
          label: "Account 0",
          pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H0",
          pkh: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
          seedFingerPrint: "mockPrint1",
          type: "mnemonic",
        },
        {
          curve: "ed25519",
          derivationPath: "m/44'/1729'/1'/0'",
          label: "Account 1",
          pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H1",
          pkh: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
          seedFingerPrint: "mockPrint1",
          type: "mnemonic",
        },
        {
          curve: "ed25519",
          derivationPath: "m/44'/1729'/2'/0'",
          label: "my new account",
          pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
          pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
          seedFingerPrint: "mockPrint1",
          type: "mnemonic",
        },
      ];
      expect(store.getState().accounts.items).toEqual(expected);
    });
  });
});
