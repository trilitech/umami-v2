import {
  type ImplicitAccount,
  mockContractContact,
  mockImplicitContact,
  mockSocialAccount,
} from "@umami/core";
import { mnemonic1 } from "@umami/test-utils";
import {
  MAINNET,
  defaultDerivationPathTemplate,
  getDefaultDerivationPath,
  getFingerPrint,
  isAccountRevealed,
} from "@umami/tezos";

import { restoreRevealedPublicKeyPairs, useRestoreRevealedMnemonicAccounts } from "./mnemonic";
import { contactsActions, networksActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import { addTestAccount, fakeIsAccountRevealed, renderHook } from "../testUtils";

jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  isAccountRevealed: jest.fn(),
  getFingerPrint: jest.fn(),
}));

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

const testPublicKeys = {
  ed25519: [
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
  ],
  secp256k1: [
    {
      pk: "sppk7aVaRDWwyLRP3iL79sNavXktYCK8x3i7ywhZC9LAFiqyb4DvJNA",
      pkh: "tz2V1jhdHEHk1WdJyFjEqRKd1HSDXDHRs8RH",
    },
    {
      pk: "sppk7Zv3fwDZGY2jqDtiCeLqqEuNgrqv2eEP2muanMKx8c1c54n4MgJ",
      pkh: "tz2PDDyYArGYPqbwSQ7Cgr5Ejt3mQfcuiGpg",
    },
    {
      pk: "sppk7Zjenr9Wm3LJwXEbQeCXzahag8L76H4Du3gGERt98zQB9pCXoaB",
      pkh: "tz2C4vEw8qJJz9uojG4cGNAAP9ZHkRBLEChS",
    },
  ],
  p256: [
    {
      pk: "p2pk66NyfBBw8CNy6CqRKBnwMUz5XeTw4vGfPcQXNWFLvFkQcaLs6gj",
      pkh: "tz3e2DhEg6Hyvo8a68kj3RcQw4C9ywYaYC5P",
    },
    {
      pk: "p2pk66YjF7ecLagxiZoyeh9HcaKDRnpCJTqraBE4c8ouvHzs14DZR6G",
      pkh: "tz3TQnh3ZawePApy3hyPKyb6ogXbzgaaSBS9",
    },
    {
      pk: "p2pk66GF3QmyJu4XzHiCvVVimn5CbM7pngsqAKWb9vnC2EVTbyVvAqd",
      pkh: "tz3ixLL9NRNVJLWbGteEsnyvpQoHY53oPKu9",
    },
  ],
};

beforeEach(() => {
  jest.mocked(getFingerPrint).mockResolvedValue("mockFingerPrint");
});

describe.each(["ed25519", "secp256k1", "p256"] as const)("with %s curve", curve => {
  describe("restoreRevealedPublicKeyPairs", () => {
    it("restores existing accounts", async () => {
      jest
        .mocked(isAccountRevealed)
        .mockImplementation(fakeIsAccountRevealed(testPublicKeys[curve]));

      const result = await restoreRevealedPublicKeyPairs(
        mnemonic1,
        defaultDerivationPathTemplate,
        curve,
        MAINNET
      );

      expect(result).toEqual(testPublicKeys[curve]);
    });

    it("restores first account if none exists", async () => {
      jest.mocked(isAccountRevealed).mockImplementation(fakeIsAccountRevealed([]));

      const result = await restoreRevealedPublicKeyPairs(
        mnemonic1,
        defaultDerivationPathTemplate,
        curve,
        MAINNET
      );

      expect(result).toEqual(testPublicKeys[curve].slice(0, 1));
    });

    it("stops at first unrevealed account", async () => {
      jest
        .mocked(isAccountRevealed)
        .mockImplementation(
          fakeIsAccountRevealed([testPublicKeys[curve][0], testPublicKeys[curve][2]])
        );

      const result = await restoreRevealedPublicKeyPairs(
        mnemonic1,
        defaultDerivationPathTemplate,
        curve,
        MAINNET
      );

      expect(result).toEqual(testPublicKeys[curve].slice(0, 1));
    });
  });

  describe("useRestoreRevealedMnemonicAccounts", () => {
    const CUSTOM_LABEL = "myLabel";

    it("restores existing accounts", async () => {
      const expected: ImplicitAccount[] = testPublicKeys[curve].map(({ pk, pkh }, index) => ({
        derivationPath: getDefaultDerivationPath(index),
        pk,
        address: { type: "implicit", pkh },
        curve,
        label: index ? `${CUSTOM_LABEL} ${index + 1}` : CUSTOM_LABEL,
        type: "mnemonic",
        seedFingerPrint: "mockFingerPrint",
        derivationPathTemplate: "44'/1729'/?'/0'",
      }));

      jest
        .mocked(isAccountRevealed)
        .mockImplementation(fakeIsAccountRevealed(expected.map(account => account.address)));

      const {
        result: { current: restoreRevealedMnemonicsHook },
      } = renderHook(() => useRestoreRevealedMnemonicAccounts(), { store });
      const result = await restoreRevealedMnemonicsHook(
        mnemonic1,
        MAINNET,
        defaultDerivationPathTemplate,
        CUSTOM_LABEL,
        curve
      );

      expect(result).toEqual(expected);
    });

    it("restores one account if none were revealed", async () => {
      jest.mocked(isAccountRevealed).mockImplementation(fakeIsAccountRevealed([]));

      const {
        result: { current: restoreRevealedMnemonicsHook },
      } = renderHook(() => useRestoreRevealedMnemonicAccounts(), { store });
      const result = await restoreRevealedMnemonicsHook(
        mnemonic1,
        MAINNET,
        defaultDerivationPathTemplate,
        CUSTOM_LABEL,
        curve
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
        .mockImplementation(fakeIsAccountRevealed(testPublicKeys[curve].slice(0, 3)));
      store.dispatch(networksActions.setCurrent(MAINNET));
      store.dispatch(contactsActions.upsert(mockImplicitContact(1, CUSTOM_LABEL)));
      store.dispatch(
        contactsActions.upsert(mockContractContact(0, "ghostnet", `${CUSTOM_LABEL} 4`))
      );
      store.dispatch(
        contactsActions.upsert(mockContractContact(2, "mainnet", `${CUSTOM_LABEL} 5`))
      );
      addTestAccount(store, mockSocialAccount(1, `${CUSTOM_LABEL} 3`));

      const {
        result: { current: restoreRevealedMnemonicsHook },
      } = renderHook(() => useRestoreRevealedMnemonicAccounts(), { store });
      const result = await restoreRevealedMnemonicsHook(
        mnemonic1,
        MAINNET,
        defaultDerivationPathTemplate,
        CUSTOM_LABEL,
        curve
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
        .mockImplementation(fakeIsAccountRevealed(testPublicKeys[curve].slice(0, 2)));

      const {
        result: { current: restoreRevealedMnemonicsHook },
      } = renderHook(() => useRestoreRevealedMnemonicAccounts(), { store });
      const result = await restoreRevealedMnemonicsHook(
        mnemonic1,
        MAINNET,
        "44'/1729'/?'/0'",
        "Account",
        curve
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
});
