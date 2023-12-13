import { renderHook } from "@testing-library/react";

import {
  defaultDerivationPathPattern,
  getDefaultDerivationPath,
} from "./account/derivationPathUtils";
import { restoreRevealedPublicKeyPairs, useRestoreRevealedMnemonicAccounts } from "./mnemonic";
import { accountsSlice } from "./redux/slices/accountsSlice";
import { store } from "./redux/store";
import { checkAccountsAndUpsertContact } from "./redux/thunks/checkAccountsAndUpsertContact";
import { addressExists, getFingerPrint } from "./tezos";
import { mockContact, mockSocialAccount } from "../mocks/factories";
import { mnemonic1 } from "../mocks/mockMnemonic";
import { ReduxStore } from "../providers/ReduxStore";
import { ImplicitAccount } from "../types/Account";
import { RawPkh } from "../types/Address";
import { MAINNET } from "../types/Network";

const addressExistsMock = jest.mocked(addressExists);
const getFingerPrintMock = jest.mocked(getFingerPrint);

const testPublicKeys = [
  {
    pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
    pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  },
  {
    pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
    pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
  },
  {
    pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
    pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
  },
];

beforeEach(() => {
  getFingerPrintMock.mockResolvedValue("mockFingerPrint");
});

const fakeAddressExists = (revealedKeyPairs: { pkh: RawPkh }[]) => async (pkh: RawPkh) =>
  revealedKeyPairs.map(keyPair => keyPair.pkh).includes(pkh);

describe("restoreRevealedPublicKeyPairs", () => {
  it("restores existing accounts", async () => {
    addressExistsMock.mockImplementation(fakeAddressExists(testPublicKeys));

    const result = await restoreRevealedPublicKeyPairs(
      mnemonic1,
      defaultDerivationPathPattern,
      MAINNET
    );

    expect(result).toEqual(testPublicKeys);
  });

  it("restores first account if none exists", async () => {
    addressExistsMock.mockImplementation(fakeAddressExists([]));

    const result = await restoreRevealedPublicKeyPairs(
      mnemonic1,
      defaultDerivationPathPattern,
      MAINNET
    );

    expect(result).toEqual(testPublicKeys.slice(0, 1));
  });

  it("stops at first unrevealed account", async () => {
    addressExistsMock.mockImplementation(fakeAddressExists([testPublicKeys[0], testPublicKeys[2]]));

    const result = await restoreRevealedPublicKeyPairs(
      mnemonic1,
      defaultDerivationPathPattern,
      MAINNET
    );

    expect(result).toEqual(testPublicKeys.slice(0, 1));
  });
});

describe("useRestoreRevealedMnemonicAccounts", () => {
  it("restores existing accounts with a default curve and label", async () => {
    const expected: ImplicitAccount[] = [
      {
        curve: "ed25519",
        derivationPath: getDefaultDerivationPath(0),
        type: "mnemonic",
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        address: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
        seedFingerPrint: "mockFingerPrint",
        label: "Account",
        derivationPathPattern: "44'/1729'/?'/0'",
      },
      {
        curve: "ed25519",
        derivationPath: getDefaultDerivationPath(1),
        type: "mnemonic",
        pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
        address: { type: "implicit", pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6" },
        seedFingerPrint: "mockFingerPrint",
        label: "Account 2",
        derivationPathPattern: "44'/1729'/?'/0'",
      },
      {
        curve: "ed25519",
        derivationPath: getDefaultDerivationPath(2),
        type: "mnemonic",
        pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
        address: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        seedFingerPrint: "mockFingerPrint",
        label: "Account 3",
        derivationPathPattern: "44'/1729'/?'/0'",
      },
    ];
    addressExistsMock.mockImplementation(
      fakeAddressExists(expected.map(account => account.address))
    );

    const {
      result: { current: restoreRevealedMnemonicsHook },
    } = renderHook(() => useRestoreRevealedMnemonicAccounts(), {
      wrapper: ReduxStore,
    });
    const result = await restoreRevealedMnemonicsHook(
      mnemonic1,
      MAINNET,
      defaultDerivationPathPattern
    );

    expect(result).toEqual(expected);
  });

  it("restores single existing account with a provided label", async () => {
    const CUSTOM_LABEL = "myLabel";
    addressExistsMock.mockImplementation(fakeAddressExists([]));

    const {
      result: { current: restoreRevealedMnemonicsHook },
    } = renderHook(() => useRestoreRevealedMnemonicAccounts(), {
      wrapper: ReduxStore,
    });
    const result = await restoreRevealedMnemonicsHook(
      mnemonic1,
      MAINNET,
      defaultDerivationPathPattern,
      CUSTOM_LABEL
    );

    const expected: ImplicitAccount[] = [
      expect.objectContaining({
        label: CUSTOM_LABEL,
      }),
    ];
    expect(result).toEqual(expected);
  });

  it("restores multiple existing accounts with a provided label", async () => {
    const CUSTOM_LABEL = "myLabel";
    addressExistsMock.mockImplementation(fakeAddressExists(testPublicKeys.slice(0, 2)));

    const {
      result: { current: restoreRevealedMnemonicsHook },
    } = renderHook(() => useRestoreRevealedMnemonicAccounts(), {
      wrapper: ReduxStore,
    });
    const result = await restoreRevealedMnemonicsHook(
      mnemonic1,
      MAINNET,
      defaultDerivationPathPattern,
      CUSTOM_LABEL
    );

    const expected: ImplicitAccount[] = [
      expect.objectContaining({
        label: CUSTOM_LABEL,
      }),
      expect.objectContaining({
        label: `${CUSTOM_LABEL} 2`,
      }),
    ];
    expect(result).toEqual(expected);
  });

  it("sets unique labels for restored accounts", async () => {
    addressExistsMock.mockImplementation(fakeAddressExists(testPublicKeys.slice(0, 3)));
    store.dispatch(accountsSlice.actions.addAccount(mockSocialAccount(0, "Account 3")));
    store.dispatch(checkAccountsAndUpsertContact(mockContact(1, "Account")));

    const {
      result: { current: restoreRevealedMnemonicsHook },
    } = renderHook(() => useRestoreRevealedMnemonicAccounts(), {
      wrapper: ReduxStore,
    });
    const result = await restoreRevealedMnemonicsHook(
      mnemonic1,
      MAINNET,
      defaultDerivationPathPattern
    );

    const expected: ImplicitAccount[] = [
      expect.objectContaining({
        label: "Account 2",
      }),
      expect.objectContaining({
        label: "Account 4",
      }),
      expect.objectContaining({
        label: "Account 5",
      }),
    ];
    expect(result).toEqual(expected);
  });

  it("restores existing accounts with a custom derivation path", async () => {
    addressExistsMock.mockImplementation(fakeAddressExists(testPublicKeys.slice(0, 2)));

    const {
      result: { current: restoreRevealedMnemonicsHook },
    } = renderHook(() => useRestoreRevealedMnemonicAccounts(), {
      wrapper: ReduxStore,
    });
    const result = await restoreRevealedMnemonicsHook(mnemonic1, MAINNET, "44'/1729'/?'/0'");

    const expected: ImplicitAccount[] = [
      expect.objectContaining({
        label: "Account",
        derivationPath: "44'/1729'/0'/0'",
      }),
      expect.objectContaining({
        label: "Account 2",
        derivationPath: "44'/1729'/1'/0'",
      }),
    ];
    expect(result).toEqual(expected);
  });
});
