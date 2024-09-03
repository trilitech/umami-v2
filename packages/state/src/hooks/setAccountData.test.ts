import { type Curves } from "@taquito/signer";
import {
  type ImplicitAccount,
  type MnemonicAccount,
  mockImplicitAccount,
  mockLedgerAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "@umami/core";
import { decrypt, encrypt } from "@umami/crypto";
import { mnemonic1 } from "@umami/test-utils";
import {
  AVAILABLE_DERIVATION_PATH_TEMPLATES,
  derivePublicKeyPair,
  getFingerPrint,
  isAccountRevealed,
  makeDerivationPath,
} from "@umami/tezos";

import { useRemoveDependenciesAndMultisigs } from "./removeAccountDependencies";
import {
  useDeriveMnemonicAccount,
  useRemoveAccount,
  useRemoveMnemonic,
  useRemoveNonMnemonic,
  useRestoreFromMnemonic,
} from "./setAccountData";
import { accountsActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import {
  act,
  addTestAccount,
  addTestAccounts,
  fakeIsAccountRevealed,
  renderHook,
} from "../testUtils";

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

jest.mock("./removeAccountDependencies");
jest.mock("@umami/crypto", () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));
jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  getFingerPrint: jest.fn(),
  isAccountRevealed: jest.fn(),
}));

const mockedUseRemoveDependenciesAndMultisigs = jest.mocked(useRemoveDependenciesAndMultisigs);
const mockedRemoveAccountsDependencies = jest.fn();

beforeEach(() =>
  mockedUseRemoveDependenciesAndMultisigs.mockReturnValue(mockedRemoveAccountsDependencies)
);

describe.each(["ed25519", "secp256k1", "p256"] as const)(
  "setAccountDataHooks with %s curve",
  curve => {
    describe("mnemonic accounts", () => {
      const LABEL_BASE = "Test acc";
      const PASSWORD = "password";
      const DERIVATION_PATH_TEMPLATE = AVAILABLE_DERIVATION_PATH_TEMPLATES[2].value;

      const MOCK_FINGERPRINT = "mockFingerPrint";
      const MOCK_ENCRYPTED = { mock: "encrypted" } as any;

      const mnemonicAccount = async (
        index: number,
        label: string,
        curve: Curves
      ): Promise<MnemonicAccount> => {
        const pubKeyPair = await derivePublicKeyPair(
          mnemonic1,
          makeDerivationPath(DERIVATION_PATH_TEMPLATE, index),
          curve
        );
        return {
          curve,
          derivationPath: makeDerivationPath(DERIVATION_PATH_TEMPLATE, index),
          type: "mnemonic",
          pk: pubKeyPair.pk,
          address: { type: "implicit", pkh: pubKeyPair.pkh },
          seedFingerPrint: MOCK_FINGERPRINT,
          label: label,
          derivationPathTemplate: DERIVATION_PATH_TEMPLATE,
          isVerified: true,
        };
      };

      describe("useRestoreFromMnemonic", () => {
        beforeEach(() => {
          jest.mocked(getFingerPrint).mockResolvedValue(MOCK_FINGERPRINT);
          jest.mocked(encrypt).mockReturnValue(Promise.resolve(MOCK_ENCRYPTED));
        });

        it("restores only one account if none revealed", async () => {
          const expected: ImplicitAccount[] = [await mnemonicAccount(0, LABEL_BASE, curve)];

          const {
            result: { current: restoreFromMnemonic },
          } = renderHook(() => useRestoreFromMnemonic(), { store });
          await act(() =>
            restoreFromMnemonic({
              mnemonic: mnemonic1,
              password: PASSWORD,
              derivationPathTemplate: DERIVATION_PATH_TEMPLATE,
              label: LABEL_BASE,
              curve,
            })
          );

          expect(store.getState().accounts.items).toEqual(expected);
          expect(store.getState().accounts.seedPhrases).toEqual({
            [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
          });
          expect(getFingerPrint).toHaveBeenCalledWith(mnemonic1);
          // Encrypts given mnemonic with the given password.
          expect(encrypt).toHaveBeenCalledWith(mnemonic1, PASSWORD);
        });

        it("restores revealed accounts", async () => {
          const expected = [
            await mnemonicAccount(0, LABEL_BASE, curve),
            await mnemonicAccount(1, `${LABEL_BASE} 2`, curve),
            await mnemonicAccount(2, `${LABEL_BASE} 3`, curve),
          ];
          // Reveal mnemonic accounts
          const revealedAccounts = [
            ...expected,
            // Account 3 is not revealed. Restoration stops at first unrevealed account.
            await mnemonicAccount(4, `${LABEL_BASE} 5`, curve),
            await mnemonicAccount(5, `${LABEL_BASE} 6`, curve),
          ];
          jest
            .mocked(isAccountRevealed)
            .mockImplementation(
              fakeIsAccountRevealed(revealedAccounts.map(account => account.address))
            );

          const {
            result: { current: restoreFromMnemonic },
          } = renderHook(() => useRestoreFromMnemonic(), { store });
          await act(() =>
            restoreFromMnemonic({
              mnemonic: mnemonic1,
              password: PASSWORD,
              derivationPathTemplate: DERIVATION_PATH_TEMPLATE,
              label: LABEL_BASE,
              curve,
            })
          );

          expect(store.getState().accounts.items).toEqual(expected);
          expect(store.getState().accounts.seedPhrases).toEqual({
            [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
          });
          expect(getFingerPrint).toHaveBeenCalledWith(mnemonic1);
          // Encrypts given mnemonic with the given password.
          expect(encrypt).toHaveBeenCalledWith(mnemonic1, PASSWORD);
        });

        it("assigns unique labels to revealed accounts", async () => {
          // Add existing accounts
          const existingAccounts = [
            mockSocialAccount(0, LABEL_BASE),
            mockSecretKeyAccount(2, `${LABEL_BASE} 3`),
          ];
          addTestAccounts(store, existingAccounts);
          // Labels "labelBase" & "labelBase 3" are taken by other types of accounts.
          // The next available labels are "labelBase 2" & "labelBase 4".
          const expected = [
            await mnemonicAccount(0, `${LABEL_BASE} 2`, curve),
            await mnemonicAccount(1, `${LABEL_BASE} 4`, curve),
            await mnemonicAccount(2, `${LABEL_BASE} 5`, curve),
          ];
          // Reveal mnemonic accounts
          jest
            .mocked(isAccountRevealed)
            .mockImplementation(fakeIsAccountRevealed(expected.map(account => account.address)));

          const {
            result: { current: restoreFromMnemonic },
          } = renderHook(() => useRestoreFromMnemonic(), { store });
          await act(() =>
            restoreFromMnemonic({
              mnemonic: mnemonic1,
              password: PASSWORD,
              derivationPathTemplate: DERIVATION_PATH_TEMPLATE,
              label: LABEL_BASE,
              curve,
            })
          );

          expect(store.getState().accounts.items).toEqual([...existingAccounts, ...expected]);
          expect(store.getState().accounts.seedPhrases).toEqual({
            [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
          });
        });
      });

      describe("useDeriveMnemonicAccount", () => {
        beforeEach(() => jest.mocked(decrypt).mockResolvedValue(mnemonic1));

        it("throws if we try to derive from an unknown seedphrase", async () => {
          const UNKNOWN_FINGERPRINT = "unknown fingerprint";
          store.dispatch(
            accountsActions.addMnemonicAccounts({
              seedFingerprint: MOCK_FINGERPRINT,
              accounts: [],
              encryptedMnemonic: MOCK_ENCRYPTED,
            })
          );

          const {
            result: { current: deriveMnemonicAccount },
          } = renderHook(() => useDeriveMnemonicAccount(), { store });
          await expect(() =>
            deriveMnemonicAccount({
              fingerPrint: UNKNOWN_FINGERPRINT,
              password: PASSWORD,
              label: LABEL_BASE,
            })
          ).rejects.toThrow(`No seedphrase found with fingerprint: ${UNKNOWN_FINGERPRINT}`);

          expect(store.getState().accounts.items).toEqual([]);
          expect(store.getState().accounts.seedPhrases).toEqual({
            [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
          });
        });

        it("derives and adds an account after the last index", async () => {
          const existingAccounts = [
            (await mnemonicAccount(0, `${LABEL_BASE}`, curve)) as MnemonicAccount,
            (await mnemonicAccount(1, `${LABEL_BASE} 1`, curve)) as MnemonicAccount,
          ];
          const expected = await mnemonicAccount(2, `${LABEL_BASE} 2`, curve);
          store.dispatch(
            accountsActions.addMnemonicAccounts({
              seedFingerprint: MOCK_FINGERPRINT,
              accounts: existingAccounts,
              encryptedMnemonic: MOCK_ENCRYPTED,
            })
          );

          const {
            result: { current: deriveMnemonicAccount },
          } = renderHook(() => useDeriveMnemonicAccount(), { store });
          await act(() =>
            deriveMnemonicAccount({
              fingerPrint: MOCK_FINGERPRINT,
              password: PASSWORD,
              label: LABEL_BASE,
            })
          );

          expect(store.getState().accounts.items).toEqual([...existingAccounts, expected]);
          expect(store.getState().accounts.seedPhrases).toEqual({
            [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
          });
          expect(jest.mocked(decrypt)).toHaveBeenCalledWith(MOCK_ENCRYPTED, PASSWORD);
        });

        it("uses decrypt with encrypted mnemonic stored for the group", async () => {
          const existingAccounts = [
            (await mnemonicAccount(0, `${LABEL_BASE}`, curve)) as MnemonicAccount,
            (await mnemonicAccount(1, `${LABEL_BASE} 1`, curve)) as MnemonicAccount,
          ];
          store.dispatch(
            accountsActions.addMnemonicAccounts({
              seedFingerprint: MOCK_FINGERPRINT,
              accounts: existingAccounts,
              encryptedMnemonic: MOCK_ENCRYPTED,
            })
          );

          const {
            result: { current: deriveMnemonicAccount },
          } = renderHook(() => useDeriveMnemonicAccount(), { store });
          await act(() =>
            deriveMnemonicAccount({
              fingerPrint: MOCK_FINGERPRINT,
              password: PASSWORD,
              label: LABEL_BASE,
            })
          );

          expect(jest.mocked(decrypt)).toHaveBeenCalledWith(MOCK_ENCRYPTED, PASSWORD);
        });

        it("assigns unique label to derived account", async () => {
          const otherAccounts = [
            mockSocialAccount(0, LABEL_BASE),
            mockSecretKeyAccount(2, `${LABEL_BASE} 5`),
          ];
          addTestAccounts(store, otherAccounts);
          const existingAccounts = [
            await mnemonicAccount(0, `${LABEL_BASE} 2`, curve),
            await mnemonicAccount(1, `${LABEL_BASE} 4`, curve),
          ];
          // Labels "labelBase" & "labelBase 5" are taken by other types of accounts.
          // Labels "labelBase 2" & "labelBase 4" are taken by existing mnemonic accounts.
          // The next available label is "labelBase 3".
          const expected = await mnemonicAccount(2, `${LABEL_BASE} 3`, curve);
          store.dispatch(
            accountsActions.addMnemonicAccounts({
              seedFingerprint: MOCK_FINGERPRINT,
              accounts: existingAccounts,
              encryptedMnemonic: MOCK_ENCRYPTED,
            })
          );

          const {
            result: { current: deriveMnemonicAccount },
          } = renderHook(() => useDeriveMnemonicAccount(), { store });
          await act(() =>
            deriveMnemonicAccount({
              fingerPrint: MOCK_FINGERPRINT,
              password: PASSWORD,
              label: LABEL_BASE,
            })
          );

          expect(store.getState().accounts.items).toEqual([
            ...otherAccounts,
            ...existingAccounts,
            expected,
          ]);
          expect(store.getState().accounts.seedPhrases).toEqual({
            [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
          });
        });
      });
    });
  }
);

describe("useRemoveMnemonic", () => {
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

  it("deletes all accounts with given fingerprint", () => {
    const {
      result: { current: removeMnemonic },
    } = renderHook(() => useRemoveMnemonic(), { store });

    act(() => removeMnemonic("mockPrint1"));

    expect(store.getState().accounts.items).toEqual([
      mockImplicitAccount(2, undefined, "mockPrint2"),
    ]);
  });

  it("calls removeAccountsDependencies with all accounts with given fingerprint", () => {
    const {
      result: { current: removeMnemonic },
    } = renderHook(() => useRemoveMnemonic(), { store });

    act(() => removeMnemonic("mockPrint1"));

    expect(mockedRemoveAccountsDependencies).toHaveBeenCalledWith([
      mockImplicitAccount(1, undefined, "mockPrint1"),
      mockImplicitAccount(3, undefined, "mockPrint1"),
    ]);
  });
});

describe("useRemoveNonMnemonic", () => {
  const accounts = [
    mockSocialAccount(1),
    mockSocialAccount(2),
    mockLedgerAccount(3),
    mockLedgerAccount(4),
    mockSecretKeyAccount(5),
    mockSecretKeyAccount(6),
  ];

  beforeEach(() => addTestAccounts(store, accounts));

  describe.each(["social" as const, "ledger" as const, "secret_key" as const])(
    "for %s type",
    type => {
      it("deletes all accounts", () => {
        const {
          result: { current: removeNonMnemonic },
        } = renderHook(() => useRemoveNonMnemonic(), { store });

        act(() => removeNonMnemonic(type));

        expect(store.getState().accounts.items).toEqual(
          accounts.filter(account => account.type !== type)
        );
      });

      it("calls removeAccountsDependencies with all accounts", () => {
        const {
          result: { current: removeNonMnemonic },
        } = renderHook(() => useRemoveNonMnemonic(), { store });

        act(() => removeNonMnemonic(type));

        expect(mockedRemoveAccountsDependencies).toHaveBeenCalledWith(
          accounts.filter(account => account.type === type)
        );
      });
    }
  );
});

describe("useRemoveAccount", () => {
  it("deletes secret key on deleting secret key account", () => {
    const account = mockSecretKeyAccount(0);
    addTestAccount(store, account);
    store.dispatch(
      accountsActions.addSecretKey({
        pkh: account.address.pkh,
        encryptedSecretKey: "encryptedSecretKey" as any,
      })
    );

    const {
      result: { current: removeAccount },
    } = renderHook(() => useRemoveAccount(), { store });
    act(() => removeAccount(account));

    expect(store.getState().accounts.items).toEqual([]);
    expect(store.getState().accounts.secretKeys).toEqual({});
  });

  it("calls removeAccountsDependencies with the account", () => {
    const {
      result: { current: removeAccount },
    } = renderHook(() => useRemoveAccount(), { store });

    act(() => removeAccount(mockSocialAccount(5)));

    expect(mockedRemoveAccountsDependencies).toHaveBeenCalledWith([mockSocialAccount(5)]);
  });
});
