import {
  defaultDerivationPathTemplate,
  getDefaultDerivationPath,
} from "./account/derivationPathUtils";
import { restoreRevealedPublicKeyPairs, useRestoreRevealedMnemonicAccounts } from "./mnemonic";
import { contactsActions } from "./redux/slices/contactsSlice";
import { networksActions } from "./redux/slices/networks";
import { store } from "./redux/store";
import * as tezosHelpers from "./tezos/helpers";
import { mockContractContact, mockImplicitContact, mockSocialAccount } from "../mocks/factories";
import { addAccount, fakeAddressExists } from "../mocks/helpers";
import { mnemonic1 } from "../mocks/mockMnemonic";
import { renderHook } from "../mocks/testUtils";
import { ImplicitAccount } from "../types/Account";
import { MAINNET } from "../types/Network";

jest.unmock("./tezos");

const addressExistsMock = jest.spyOn(tezosHelpers, "addressExists");

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
  jest.spyOn(tezosHelpers, "getFingerPrint").mockResolvedValue("mockFingerPrint");
});

describe("restoreRevealedPublicKeyPairs", () => {
  it("restores existing accounts", async () => {
    addressExistsMock.mockImplementation(fakeAddressExists(testPublicKeys));

    const result = await restoreRevealedPublicKeyPairs(
      mnemonic1,
      defaultDerivationPathTemplate,
      MAINNET
    );

    expect(result).toEqual(testPublicKeys);
  });

  it("restores first account if none exists", async () => {
    addressExistsMock.mockImplementation(fakeAddressExists([]));

    const result = await restoreRevealedPublicKeyPairs(
      mnemonic1,
      defaultDerivationPathTemplate,
      MAINNET
    );

    expect(result).toEqual(testPublicKeys.slice(0, 1));
  });

  it("stops at first unrevealed account", async () => {
    addressExistsMock.mockImplementation(fakeAddressExists([testPublicKeys[0], testPublicKeys[2]]));

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
    addressExistsMock.mockImplementation(
      fakeAddressExists(expected.map(account => account.address))
    );

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
    addressExistsMock.mockImplementation(fakeAddressExists([]));

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
    addressExistsMock.mockImplementation(fakeAddressExists(testPublicKeys.slice(0, 3)));
    store.dispatch(networksActions.setCurrent(MAINNET));
    store.dispatch(contactsActions.upsert(mockImplicitContact(1, CUSTOM_LABEL)));
    store.dispatch(contactsActions.upsert(mockContractContact(0, "ghostnet", `${CUSTOM_LABEL} 4`)));
    store.dispatch(contactsActions.upsert(mockContractContact(2, "mainnet", `${CUSTOM_LABEL} 5`)));
    addAccount(mockSocialAccount(1, `${CUSTOM_LABEL} 3`));

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
    addressExistsMock.mockImplementation(fakeAddressExists(testPublicKeys.slice(0, 2)));

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
