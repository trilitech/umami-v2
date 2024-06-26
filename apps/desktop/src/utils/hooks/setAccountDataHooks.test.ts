import { type ImplicitAccount, type MnemonicAccount } from "@umami/core";
import { decrypt, encrypt } from "@umami/crypto";
import {
  mnemonic1,
  mockImplicitAccount,
  mockLedgerAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "@umami/test-utils";
import { AVAILABLE_DERIVATION_PATH_TEMPLATES, makeDerivationPath } from "@umami/tezos";

import { useRemoveDependenciesAndMultisigs } from "./removeAccountDependenciesHooks";
import {
  useDeriveMnemonicAccount,
  useRemoveAccount,
  useRemoveMnemonic,
  useRemoveNonMnemonic,
  useRestoreFromMnemonic,
} from "./setAccountDataHooks";
import { addAccount, fakeIsAccountRevealed } from "../../mocks/helpers";
import { act, renderHook } from "../../mocks/testUtils";
import { accountsSlice } from "../redux/slices/accountsSlice/accountsSlice";
import { store } from "../redux/store";
import * as tezosHelpers from "../tezos/helpers";

jest.mock("./removeAccountDependenciesHooks");
jest.mock("@umami/crypto", () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));

const mockedUseRemoveDependenciesAndMultisigs = jest.mocked(useRemoveDependenciesAndMultisigs);
const mockedRemoveAccountsDependencies = jest.fn();

describe("setAccountDataHooks", () => {
  beforeEach(() => {
    mockedUseRemoveDependenciesAndMultisigs.mockReturnValue(mockedRemoveAccountsDependencies);
  });

  describe("mnemonic accounts", () => {
    const isAccountRevealedMock = jest.spyOn(tezosHelpers, "isAccountRevealed");
    const getFingerPrintMock = jest.spyOn(tezosHelpers, "getFingerPrint");

    const LABEL_BASE = "Test acc";
    const PASSWORD = "password";
    const DERIVATION_PATH_TEMPLATE = AVAILABLE_DERIVATION_PATH_TEMPLATES[2].value;

    const MOCK_FINGERPRINT = "mockFingerPrint";
    const MOCK_ENCRYPTED = { mock: "encrypted" } as any;

    const mnemonicAccount = async (index: number, label: string): Promise<MnemonicAccount> => {
      const pubKeyPair = await tezosHelpers.derivePublicKeyPair(
        mnemonic1,
        makeDerivationPath(DERIVATION_PATH_TEMPLATE, index)
      );
      return {
        curve: "ed25519",
        derivationPath: makeDerivationPath(DERIVATION_PATH_TEMPLATE, index),
        type: "mnemonic",
        pk: pubKeyPair.pk,
        address: { type: "implicit", pkh: pubKeyPair.pkh },
        seedFingerPrint: MOCK_FINGERPRINT,
        label: label,
        derivationPathTemplate: DERIVATION_PATH_TEMPLATE,
      };
    };

    describe("useRestoreFromMnemonic", () => {
      beforeEach(() => {
        getFingerPrintMock.mockResolvedValue(MOCK_FINGERPRINT);
        jest.mocked(encrypt).mockReturnValue(Promise.resolve(MOCK_ENCRYPTED));
      });

      it("restores only one account if none revealed", async () => {
        const expected: ImplicitAccount[] = [await mnemonicAccount(0, LABEL_BASE)];

        const {
          result: { current: restoreFromMnemonic },
        } = renderHook(() => useRestoreFromMnemonic());
        await act(() =>
          restoreFromMnemonic({
            mnemonic: mnemonic1,
            password: PASSWORD,
            derivationPathTemplate: DERIVATION_PATH_TEMPLATE,
            label: LABEL_BASE,
          })
        );

        expect(store.getState().accounts.items).toEqual(expected);
        expect(store.getState().accounts.seedPhrases).toEqual({
          [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
        });
        expect(tezosHelpers.getFingerPrint).toHaveBeenCalledWith(mnemonic1);
        // Encrypts given mnemonic with the given password.
        expect(jest.mocked(encrypt)).toHaveBeenCalledWith(mnemonic1, PASSWORD);
      });

      it("restores revealed accounts", async () => {
        const expected = [
          await mnemonicAccount(0, LABEL_BASE),
          await mnemonicAccount(1, `${LABEL_BASE} 2`),
          await mnemonicAccount(2, `${LABEL_BASE} 3`),
        ];
        // Reveal mnemonic accounts
        const revealedAccounts = [
          ...expected,
          // Account 3 is not revealed. Restoration stops at first unrevealed account.
          await mnemonicAccount(4, `${LABEL_BASE} 5`),
          await mnemonicAccount(5, `${LABEL_BASE} 6`),
        ];
        isAccountRevealedMock.mockImplementation(
          fakeIsAccountRevealed(revealedAccounts.map(account => account.address))
        );

        const {
          result: { current: restoreFromMnemonic },
        } = renderHook(() => useRestoreFromMnemonic());
        await act(() =>
          restoreFromMnemonic({
            mnemonic: mnemonic1,
            password: PASSWORD,
            derivationPathTemplate: DERIVATION_PATH_TEMPLATE,
            label: LABEL_BASE,
          })
        );

        expect(store.getState().accounts.items).toEqual(expected);
        expect(store.getState().accounts.seedPhrases).toEqual({
          [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
        });
        expect(tezosHelpers.getFingerPrint).toHaveBeenCalledWith(mnemonic1);
        // Encrypts given mnemonic with the given password.
        expect(jest.mocked(encrypt)).toHaveBeenCalledWith(mnemonic1, PASSWORD);
      });

      it("assigns unique labels to revealed accounts", async () => {
        // Add existing accounts
        const existingAccounts = [
          mockSocialAccount(0, LABEL_BASE),
          mockSecretKeyAccount(2, `${LABEL_BASE} 3`),
        ];
        existingAccounts.forEach(addAccount);
        // Labels "labelBase" & "labelBase 3" are taken by other types of accounts.
        // The next available labels are "labelBase 2" & "labelBase 4".
        const expected = [
          await mnemonicAccount(0, `${LABEL_BASE} 2`),
          await mnemonicAccount(1, `${LABEL_BASE} 4`),
          await mnemonicAccount(2, `${LABEL_BASE} 5`),
        ];
        // Reveal mnemonic accounts
        isAccountRevealedMock.mockImplementation(
          fakeIsAccountRevealed(expected.map(account => account.address))
        );

        const {
          result: { current: restoreFromMnemonic },
        } = renderHook(() => useRestoreFromMnemonic());
        await act(() =>
          restoreFromMnemonic({
            mnemonic: mnemonic1,
            password: PASSWORD,
            derivationPathTemplate: DERIVATION_PATH_TEMPLATE,
            label: LABEL_BASE,
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
          accountsSlice.actions.addMnemonicAccounts({
            seedFingerprint: MOCK_FINGERPRINT,
            accounts: [],
            encryptedMnemonic: MOCK_ENCRYPTED,
          })
        );

        const {
          result: { current: deriveMnemonicAccount },
        } = renderHook(() => useDeriveMnemonicAccount());
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
          (await mnemonicAccount(0, `${LABEL_BASE}`)) as MnemonicAccount,
          (await mnemonicAccount(1, `${LABEL_BASE} 1`)) as MnemonicAccount,
        ];
        const expected = await mnemonicAccount(2, `${LABEL_BASE} 2`);
        store.dispatch(
          accountsSlice.actions.addMnemonicAccounts({
            seedFingerprint: MOCK_FINGERPRINT,
            accounts: existingAccounts,
            encryptedMnemonic: MOCK_ENCRYPTED,
          })
        );

        const {
          result: { current: deriveMnemonicAccount },
        } = renderHook(() => useDeriveMnemonicAccount());
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
          (await mnemonicAccount(0, `${LABEL_BASE}`)) as MnemonicAccount,
          (await mnemonicAccount(1, `${LABEL_BASE} 1`)) as MnemonicAccount,
        ];
        store.dispatch(
          accountsSlice.actions.addMnemonicAccounts({
            seedFingerprint: MOCK_FINGERPRINT,
            accounts: existingAccounts,
            encryptedMnemonic: MOCK_ENCRYPTED,
          })
        );

        const {
          result: { current: deriveMnemonicAccount },
        } = renderHook(() => useDeriveMnemonicAccount());
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
        otherAccounts.forEach(addAccount);
        const existingAccounts = [
          await mnemonicAccount(0, `${LABEL_BASE} 2`),
          await mnemonicAccount(1, `${LABEL_BASE} 4`),
        ];
        // Labels "labelBase" & "labelBase 5" are taken by other types of accounts.
        // Labels "labelBase 2" & "labelBase 4" are taken by existing mnemonic accounts.
        // The next available label is "labelBase 3".
        const expected = await mnemonicAccount(2, `${LABEL_BASE} 3`);
        store.dispatch(
          accountsSlice.actions.addMnemonicAccounts({
            seedFingerprint: MOCK_FINGERPRINT,
            accounts: existingAccounts,
            encryptedMnemonic: MOCK_ENCRYPTED,
          })
        );

        const {
          result: { current: deriveMnemonicAccount },
        } = renderHook(() => useDeriveMnemonicAccount());
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

  describe("useRemoveMnemonic", () => {
    beforeEach(() => {
      store.dispatch(
        accountsSlice.actions.addMnemonicAccounts({
          seedFingerprint: "mockPrint1",
          accounts: [
            mockImplicitAccount(1, undefined, "mockPrint1") as MnemonicAccount,
            mockImplicitAccount(3, undefined, "mockPrint1") as MnemonicAccount,
          ],
          encryptedMnemonic: {} as any,
        })
      );
      store.dispatch(
        accountsSlice.actions.addMnemonicAccounts({
          seedFingerprint: "mockPrint2",
          accounts: [mockImplicitAccount(2, undefined, "mockPrint2") as MnemonicAccount],
          encryptedMnemonic: {} as any,
        })
      );
    });

    it("deletes all accounts with given fingerprint", () => {
      const {
        result: { current: removeMnemonic },
      } = renderHook(() => useRemoveMnemonic());

      act(() => removeMnemonic("mockPrint1"));

      expect(store.getState().accounts.items).toEqual([
        mockImplicitAccount(2, undefined, "mockPrint2"),
      ]);
    });

    it("calls removeAccountsDependencies with all accounts with given fingerprint", () => {
      const {
        result: { current: removeMnemonic },
      } = renderHook(() => useRemoveMnemonic());

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

    beforeEach(() => accounts.forEach(addAccount));

    describe.each(["social" as const, "ledger" as const, "secret_key" as const])(
      "for %s type",
      type => {
        it("deletes all accounts", () => {
          const {
            result: { current: removeNonMnemonic },
          } = renderHook(() => useRemoveNonMnemonic());

          act(() => removeNonMnemonic(type));

          expect(store.getState().accounts.items).toEqual(
            accounts.filter(account => account.type !== type)
          );
        });

        it("calls removeAccountsDependencies with all accounts", () => {
          const {
            result: { current: removeNonMnemonic },
          } = renderHook(() => useRemoveNonMnemonic());

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
      addAccount(account);
      store.dispatch(
        accountsSlice.actions.addSecretKey({
          pkh: account.address.pkh,
          encryptedSecretKey: "encryptedSecretKey" as any,
        })
      );

      const {
        result: { current: removeAccount },
      } = renderHook(() => useRemoveAccount());
      act(() => removeAccount(account));

      expect(store.getState().accounts.items).toEqual([]);
      expect(store.getState().accounts.secretKeys).toEqual({});
    });

    it("calls removeAccountsDependencies with the account", () => {
      const {
        result: { current: removeAccount },
      } = renderHook(() => useRemoveAccount());

      act(() => removeAccount(mockSocialAccount(5)));

      expect(mockedRemoveAccountsDependencies).toHaveBeenCalledWith([mockSocialAccount(5)]);
    });
  });
});
