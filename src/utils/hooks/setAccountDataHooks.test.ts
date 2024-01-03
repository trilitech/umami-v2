import { renderHook, waitFor } from "@testing-library/react";

import { useRestoreFromMnemonic } from "./setAccountDataHooks";
import { mockSecretKeyAccount, mockSocialAccount } from "../../mocks/factories";
import { mnemonic1 } from "../../mocks/mockMnemonic";
import { ReduxStore } from "../../providers/ReduxStore";
import { ImplicitAccount } from "../../types/Account";
import { RawPkh } from "../../types/Address";
import { AVAILABLE_DERIVATION_PATHS, makeDerivationPath } from "../account/derivationPathUtils";
import * as functionsToMock from "../crypto/AES";
import { derivePublicKeyPair } from "../mnemonic";
import { accountsSlice } from "../redux/slices/accountsSlice";
import { store } from "../redux/store";
import { addressExists, getFingerPrint } from "../tezos";

describe("setAccountDataHooks", () => {
  describe("useRestoreFromMnemonic", () => {
    const addressExistsMock = jest.mocked(addressExists);
    const getFingerPrintMock = jest.mocked(getFingerPrint);
    const encryptMock = jest.spyOn(functionsToMock, "encrypt");

    const LABEL_BASE = "Test acc";
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

    beforeEach(() => {
      getFingerPrintMock.mockResolvedValue(MOCK_FINGERPRINT);

      encryptMock.mockReturnValue(Promise.resolve(MOCK_ENCRYPTED));
    });

    const fakeAddressExists = (revealedKeyPairs: { pkh: RawPkh }[]) => async (pkh: RawPkh) =>
      revealedKeyPairs.map(keyPair => keyPair.pkh).includes(pkh);

    it("restores only one account if none revealed", async () => {
      const expected: ImplicitAccount[] = [await mnemonicAccount(0, LABEL_BASE)];

      const {
        result: { current: restoreFromMnemonic },
      } = renderHook(() => useRestoreFromMnemonic(), {
        wrapper: ReduxStore,
      });
      restoreFromMnemonic({
        mnemonic: mnemonic1,
        password: "password",
        derivationPath: DERIVATION_PATH_PATTERN,
        label: LABEL_BASE,
      });

      await waitFor(() => expect(store.getState().accounts.items).toEqual(expected));
      expect(store.getState().accounts.seedPhrases).toEqual({
        [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
      });
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
        password: "password",
        derivationPath: DERIVATION_PATH_PATTERN,
        label: LABEL_BASE,
      });

      await waitFor(() => expect(store.getState().accounts.items).toEqual(expected));
      expect(store.getState().accounts.seedPhrases).toEqual({
        [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
      });
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
      // "labelBase" & "labelBase 3" are taken, so the next available labels are "labelBase 2" & "labelBase 4"
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
        password: "password",
        derivationPath: DERIVATION_PATH_PATTERN,
        label: LABEL_BASE,
      });

      await waitFor(() =>
        expect(store.getState().accounts.items).toEqual([...existingAccounts, ...expected])
      );
      expect(store.getState().accounts.seedPhrases).toEqual({
        [MOCK_FINGERPRINT]: MOCK_ENCRYPTED,
      });
    });
  });
});
