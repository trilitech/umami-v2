import {
  type ImplicitAccount,
  mockContractContact,
  mockImplicitContact,
  mockSocialAccount,
} from "@umami/core";
import { addTestAccount, contactsActions, networksActions, store } from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";
import {
  MAINNET,
  defaultDerivationPathTemplate,
  getDefaultDerivationPath,
  getFingerPrint,
  isAccountRevealed,
} from "@umami/tezos";

import { restoreRevealedPublicKeyPairs, useRestoreRevealedMnemonicAccounts } from "./mnemonic";
import { fakeIsAccountRevealed } from "../mocks/helpers";
import { renderHook } from "../mocks/testUtils";

jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  isAccountRevealed: jest.fn(),
  getFingerPrint: jest.fn(),
}));

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
  jest.mocked(getFingerPrint).mockResolvedValue("mockFingerPrint");
});

describe("restoreRevealedPublicKeyPairs", () => {
  it("restores existing accounts", async () => {
    jest.mocked(isAccountRevealed).mockImplementation(fakeIsAccountRevealed(testPublicKeys));

    const result = await restoreRevealedPublicKeyPairs(
      mnemonic1,
      defaultDerivationPathTemplate,
      MAINNET
    );

    expect(result).toEqual(testPublicKeys);
  });

  it("restores first account if none exists", async () => {
    jest.mocked(isAccountRevealed).mockImplementation(fakeIsAccountRevealed([]));

    const result = await restoreRevealedPublicKeyPairs(
      mnemonic1,
      defaultDerivationPathTemplate,
      MAINNET
    );

    expect(result).toEqual(testPublicKeys.slice(0, 1));
  });

  it("stops at first unrevealed account", async () => {
    jest
      .mocked(isAccountRevealed)
      .mockImplementation(fakeIsAccountRevealed([testPublicKeys[0], testPublicKeys[2]]));

    const result = await restoreRevealedPublicKeyPairs(
      mnemonic1,
      defaultDerivationPathTemplate,
      MAINNET
    );

    expect(result).toEqual(testPublicKeys.slice(0, 1));
  });
});

describe("useRestoreRevealedMnemonicAccounts", () => {
  const CUSTOM_LABEL = "myLabel";

  it("restores existing accounts with a default curve", async () => {
    const expected: ImplicitAccount[] = [
      {
        curve: "ed25519",
        derivationPath: getDefaultDerivationPath(0),
        type: "mnemonic",
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        address: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
        seedFingerPrint: "mockFingerPrint",
        label: CUSTOM_LABEL,
        derivationPathTemplate: "44'/1729'/?'/0'",
      },
      {
        curve: "ed25519",
        derivationPath: getDefaultDerivationPath(1),
        type: "mnemonic",
        pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
        address: { type: "implicit", pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6" },
        seedFingerPrint: "mockFingerPrint",
        label: `${CUSTOM_LABEL} 2`,
        derivationPathTemplate: "44'/1729'/?'/0'",
      },
      {
        curve: "ed25519",
        derivationPath: getDefaultDerivationPath(2),
        type: "mnemonic",
        pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
        address: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        seedFingerPrint: "mockFingerPrint",
        label: `${CUSTOM_LABEL} 3`,
        derivationPathTemplate: "44'/1729'/?'/0'",
      },
    ];
    jest
      .mocked(isAccountRevealed)
      .mockImplementation(fakeIsAccountRevealed(expected.map(account => account.address)));

    const {
      result: { current: restoreRevealedMnemonicsHook },
    } = renderHook(() => useRestoreRevealedMnemonicAccounts());
    const result = await restoreRevealedMnemonicsHook(
      mnemonic1,
      MAINNET,
      defaultDerivationPathTemplate,
      CUSTOM_LABEL
    );

    expect(result).toEqual(expected);
  });

  it("restores one account if none were revealed", async () => {
    jest.mocked(isAccountRevealed).mockImplementation(fakeIsAccountRevealed([]));

    const {
      result: { current: restoreRevealedMnemonicsHook },
    } = renderHook(() => useRestoreRevealedMnemonicAccounts());
    const result = await restoreRevealedMnemonicsHook(
      mnemonic1,
      MAINNET,
      defaultDerivationPathTemplate,
      CUSTOM_LABEL
    );

    const expected: ImplicitAccount[] = [
      expect.objectContaining({
        label: CUSTOM_LABEL,
      }),
    ];
    expect(result).toEqual(expected);
  });

  it("sets unique labels for restored accounts", async () => {
    jest
      .mocked(isAccountRevealed)
      .mockImplementation(fakeIsAccountRevealed(testPublicKeys.slice(0, 3)));
    store.dispatch(networksActions.setCurrent(MAINNET));
    store.dispatch(contactsActions.upsert(mockImplicitContact(1, CUSTOM_LABEL)));
    store.dispatch(contactsActions.upsert(mockContractContact(0, "ghostnet", `${CUSTOM_LABEL} 4`)));
    store.dispatch(contactsActions.upsert(mockContractContact(2, "mainnet", `${CUSTOM_LABEL} 5`)));
    addTestAccount(mockSocialAccount(1, `${CUSTOM_LABEL} 3`));

    const {
      result: { current: restoreRevealedMnemonicsHook },
    } = renderHook(() => useRestoreRevealedMnemonicAccounts());
    const result = await restoreRevealedMnemonicsHook(
      mnemonic1,
      MAINNET,
      defaultDerivationPathTemplate,
      CUSTOM_LABEL
    );

    const expected: ImplicitAccount[] = [
      expect.objectContaining({
        label: `${CUSTOM_LABEL} 2`,
      }),
      expect.objectContaining({
        label: `${CUSTOM_LABEL} 6`,
      }),
      expect.objectContaining({
        label: `${CUSTOM_LABEL} 7`,
      }),
    ];
    expect(result).toEqual(expected);
  });

  it("restores existing accounts with a custom derivation path", async () => {
    jest
      .mocked(isAccountRevealed)
      .mockImplementation(fakeIsAccountRevealed(testPublicKeys.slice(0, 2)));

    const {
      result: { current: restoreRevealedMnemonicsHook },
    } = renderHook(() => useRestoreRevealedMnemonicAccounts());
    const result = await restoreRevealedMnemonicsHook(
      mnemonic1,
      MAINNET,
      "44'/1729'/?'/0'",
      "Account"
    );

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
