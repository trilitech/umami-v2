import { renderHook, waitFor } from "@testing-library/react";

import { useDeriveMnemonicAccount, useRestoreFromMnemonic } from "./setAccountDataHooks";
import { mockSecretKeyAccount, mockSocialAccount } from "../../mocks/factories";
import { mnemonic1 } from "../../mocks/mockMnemonic";
import { ReduxStore } from "../../providers/ReduxStore";
import { ImplicitAccount, MnemonicAccount } from "../../types/Account";
import { RawPkh } from "../../types/Address";
import { AVAILABLE_DERIVATION_PATHS, makeDerivationPath } from "../account/derivationPathUtils";
import * as functionsToMock from "../crypto/AES";
import { derivePublicKeyPair } from "../mnemonic";
import { accountsSlice } from "../redux/slices/accountsSlice";
import { store } from "../redux/store";
import { addressExists, getFingerPrint } from "../tezos";

describe("setAccountDataHooks", () => {
  describe("mnemonic accounts", () => {
    const addressExistsMock = jest.mocked(addressExists);
    const getFingerPrintMock = jest.mocked(getFingerPrint);
    const encryptMock = jest.spyOn(functionsToMock, "encrypt");
    const decryptMock = jest.spyOn(functionsToMock, "decrypt");

    const LABEL_BASE = "Test acc";
    const PASSWORD = "password";
    const DERIVATION_PATH_PATTERN = AVAILABLE_DERIVATION_PATHS[2].value;

    const MOCK_FINGERPRINT = "mockFingerPrint";
    const MOCK_ENCRYPTED = { mock: "encrypted" } as any;

    const mnemonicAccount = async (index: number, label: string): Promise<ImplicitAccount> => {
      const pubKeyPair = await derivePublicKeyPair(
        mnemonic1,
        makeDerivationPath(DERIVATION_PATH_PATTERN, index)
      );
      return {
        curve: "ed25519",
        derivationPath: makeDerivationPath(DERIVATION_PATH_PATTERN, index),
        type: "mnemonic",
        pk: pubKeyPair.pk,
        address: { type: "implicit", pkh: pubKeyPair.pkh },
        seedFingerPrint: MOCK_FINGERPRINT,
        label: label,
        derivationPathPattern: DERIVATION_PATH_PATTERN,
      };
    };

    describe("useRestoreFromMnemonic", () => {
      const fakeAddressExists = (revealedKeyPairs: { pkh: RawPkh }[]) => async (pkh: RawPkh) =>
        revealedKeyPairs.map(keyPair => keyPair.pkh).includes(pkh);

      beforeEach(() => {
        getFingerPrintMock.mockResolvedValue(MOCK_FINGERPRINT);
        encryptMock.mockReturnValue(Promise.resolve(MOCK_ENCRYPTED));
      });

      it("restores only one account if none revealed", async () => {
        const expected: ImplicitAccount[] = [await mnemonicAccount(0, LABEL_BASE)];

        const {
          result: { current: restoreFromMnemonic },
        } = renderHook(() => useRestoreFromMnemonic(), {
          wrapper: ReduxStore,
        });
        restoreFromMnemonic({
          mnemonic: mnemonic1,
          password: PASSWORD,
          derivationPath: DERIVATION_PATH_PATTERN,
          label: LABEL_BASE,
        });

        await waitFor(() => expect(store.getState().accounts.items).toEqual(expected), {
          timeout: 2000,
        });
        expect(store.getState().accounts.seedPhrases).toEqual({
          [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
        });
        expect(getFingerPrint).toHaveBeenCalledWith(mnemonic1);
        // Encrypts given mnemonic with the given password.
        expect(encryptMock).toHaveBeenCalledWith(mnemonic1, PASSWORD);
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
        addressExistsMock.mockImplementation(
          fakeAddressExists(revealedAccounts.map(account => account.address))
        );

        const {
          result: { current: restoreFromMnemonic },
        } = renderHook(() => useRestoreFromMnemonic(), {
          wrapper: ReduxStore,
        });
        restoreFromMnemonic({
          mnemonic: mnemonic1,
          password: PASSWORD,
          derivationPath: DERIVATION_PATH_PATTERN,
          label: LABEL_BASE,
        });

        await waitFor(() => expect(store.getState().accounts.items).toEqual(expected), {
          timeout: 2000,
        });
        expect(store.getState().accounts.seedPhrases).toEqual({
          [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
        });
        expect(getFingerPrint).toHaveBeenCalledWith(mnemonic1);
        // Encrypts given mnemonic with the given password.
        expect(encryptMock).toHaveBeenCalledWith(mnemonic1, PASSWORD);
      });

      it("assigns unique labels to revealed accounts", async () => {
        // Add existing accounts
        const existingAccounts = [
          mockSocialAccount(0, LABEL_BASE),
          mockSecretKeyAccount(2, `${LABEL_BASE} 3`),
        ];
        existingAccounts.forEach(account =>
          store.dispatch(accountsSlice.actions.addAccount(account))
        );
        // Labels "labelBase" & "labelBase 3" are taken by other types of accounts.
        // The next available labels are "labelBase 2" & "labelBase 4".
        const expected = [
          await mnemonicAccount(0, `${LABEL_BASE} 2`),
          await mnemonicAccount(1, `${LABEL_BASE} 4`),
          await mnemonicAccount(2, `${LABEL_BASE} 5`),
        ];
        // Reveal mnemonic accounts
        addressExistsMock.mockImplementation(
          fakeAddressExists(expected.map(account => account.address))
        );

        const {
          result: { current: restoreFromMnemonic },
        } = renderHook(() => useRestoreFromMnemonic(), {
          wrapper: ReduxStore,
        });
        restoreFromMnemonic({
          mnemonic: mnemonic1,
          password: PASSWORD,
          derivationPath: DERIVATION_PATH_PATTERN,
          label: LABEL_BASE,
        });

        await waitFor(
          () => expect(store.getState().accounts.items).toEqual([...existingAccounts, ...expected]),
          { timeout: 2000 }
        );
        expect(store.getState().accounts.seedPhrases).toEqual({
          [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
        });
      });
    });

    describe("useDeriveMnemonicAccount", () => {
      beforeEach(() => {
        decryptMock.mockReturnValue(Promise.resolve(mnemonic1));
      });

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
        } = renderHook(() => useDeriveMnemonicAccount(), {
          wrapper: ReduxStore,
        });
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
        } = renderHook(() => useDeriveMnemonicAccount(), {
          wrapper: ReduxStore,
        });
        deriveMnemonicAccount({
          fingerPrint: MOCK_FINGERPRINT,
          password: PASSWORD,
          label: LABEL_BASE,
        });

        await waitFor(
          () => expect(store.getState().accounts.items).toEqual([...existingAccounts, expected]),
          { timeout: 2000 }
        );
        expect(store.getState().accounts.seedPhrases).toEqual({
          [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
        });
        expect(decryptMock).toHaveBeenCalledWith(MOCK_ENCRYPTED, PASSWORD);
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
        } = renderHook(() => useDeriveMnemonicAccount(), {
          wrapper: ReduxStore,
        });
        deriveMnemonicAccount({
          fingerPrint: MOCK_FINGERPRINT,
          password: PASSWORD,
          label: LABEL_BASE,
        });

        await waitFor(() => expect(decryptMock).toHaveBeenCalledWith(MOCK_ENCRYPTED, PASSWORD));
      });

      it("assigns unique label to derived account", async () => {
        const otherAccounts = [
          mockSocialAccount(0, LABEL_BASE),
          mockSecretKeyAccount(2, `${LABEL_BASE} 5`),
        ];
        otherAccounts.forEach(account => store.dispatch(accountsSlice.actions.addAccount(account)));
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
            accounts: existingAccounts as MnemonicAccount[],
            encryptedMnemonic: MOCK_ENCRYPTED,
          })
        );

        const {
          result: { current: deriveMnemonicAccount },
        } = renderHook(() => useDeriveMnemonicAccount(), {
          wrapper: ReduxStore,
        });
        deriveMnemonicAccount({
          fingerPrint: MOCK_FINGERPRINT,
          password: PASSWORD,
          label: LABEL_BASE,
        });

        await waitFor(
          () =>
            expect(store.getState().accounts.items).toEqual([
              ...otherAccounts,
              ...existingAccounts,
              expected,
            ]),
          { timeout: 2000 }
        );
        expect(store.getState().accounts.seedPhrases).toEqual({
          [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
        });
      });
    });
  });
});
