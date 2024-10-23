import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { DerivationType, LedgerSigner } from "@taquito/ledger-signer";
import { InMemorySigner } from "@taquito/signer";
import { mnemonic1 } from "@umami/test-utils";
// import axios from "axios";
const axios = {} as any;
import MockDate from "mockdate";

import { defaultDerivationPathTemplate, getDefaultDerivationPath } from "./derivationPathUtils";
import { isAccountRevealed } from "./fetch";
import {
  curveToDerivationType,
  decryptSecretKey,
  derivePublicKeyPair,
  deriveSecretKey,
  generateHash,
  getIPFSurl,
  getPublicKeyPairFromSk,
  isValidMichelson,
  makeSigner,
} from "./helpers";
import { MAINNET } from "./Network";
import { mockImplicitAddress } from "./testUtils";

const secretKey = "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq";

describe("helpers", () => {
  it("getPublicKeyPairFromSk", async () => {
    const { pkh, pk } = await getPublicKeyPairFromSk(secretKey);

    expect(pkh).toEqual("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb");
    expect(pk).toEqual("edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn");
  });

  describe("isAccountRevealed", () => {
    it("returns true for a revealed account", async () => {
      const mockResponse = {
        data: {
          type: "user",
          revealed: true,
        },
      };
      jest.spyOn(axios, "get").mockResolvedValue(mockResponse);
      const result = await isAccountRevealed(mockImplicitAddress(0).pkh, MAINNET);
      expect(axios.get).toHaveBeenCalledWith(
        `${MAINNET.tzktApiUrl}/v1/accounts/${mockImplicitAddress(0).pkh}?select.fields=type,revealed`
      );
      expect(result).toEqual(true);
    });

    it("returns false for unrevealed account", async () => {
      const mockResponse = {
        data: {
          type: "user",
          revealed: false,
        },
      };
      jest.spyOn(axios, "get").mockResolvedValue(mockResponse);
      const result = await isAccountRevealed(mockImplicitAddress(0).pkh, MAINNET);
      expect(axios.get).toHaveBeenCalledWith(
        `${MAINNET.tzktApiUrl}/v1/accounts/${mockImplicitAddress(0).pkh}?select.fields=type,revealed`
      );
      expect(result).toEqual(false);
    });

    it("returns false for empty response", async () => {
      const mockResponse = {
        data: {
          type: "empty",
        },
      };
      jest.spyOn(axios, "get").mockResolvedValue(mockResponse);
      const result = await isAccountRevealed(mockImplicitAddress(0).pkh, MAINNET);
      expect(axios.get).toHaveBeenCalledWith(
        `${MAINNET.tzktApiUrl}/v1/accounts/${mockImplicitAddress(0).pkh}?select.fields=type,revealed`
      );
      expect(result).toEqual(false);
    });
  });

  describe("isValidMichelson", () => {
    it("returns true for valid expressions", () => {
      expect(isValidMichelson({ prim: "pair" })).toEqual(true);
      expect(isValidMichelson({ prim: "storage", args: [] })).toEqual(true);
    });

    it("returns false for invalid expressions", () => {
      expect(isValidMichelson({})).toEqual(false);
      expect(isValidMichelson({ prim: "lambda", args: {} })).toEqual(false);
    });
  });

  test("generateHash", async () => {
    MockDate.set("2022-12-27T14:15:49.760Z");
    expect(await generateHash()).toEqual("a321a5e0");
  });

  describe("curveToDerivationPath", () => {
    it.each([
      { curve: "ed25519" as const, type: DerivationType.ED25519 },
      { curve: "secp256k1" as const, type: DerivationType.SECP256K1 },
      { curve: "p256" as const, type: DerivationType.P256 },
    ])("returns the correct derivation path for %s", ({ curve, type }) => {
      expect(curveToDerivationType(curve)).toEqual(type);
    });

    it("throws an error for unsupported curves", () => {
      expect(() => curveToDerivationType("bip25519")).toThrow("bip25519 is not supported in Tezos");
    });
  });

  describe("makeSigner", () => {
    it.each(["social" as const, "mnemonic" as const, "secret_key" as const])(
      "returns an InMemorySigner for %s config",
      async type => {
        expect(await makeSigner({ type, network: MAINNET, secretKey })).toBeInstanceOf(
          InMemorySigner
        );
      }
    );

    it("returns a FakeSigner for fake config", async () => {
      const signer = await makeSigner({
        type: "fake",
        network: MAINNET,
        signer: { pk: "pk", address: mockImplicitAddress(0) },
      });

      await expect(signer.publicKey()).resolves.toEqual("pk");
      await expect(signer.publicKeyHash()).resolves.toEqual(mockImplicitAddress(0).pkh);
    });

    it("returns a LedgerSigner for ledger config", async () => {
      jest.spyOn(TransportWebUSB, "list").mockResolvedValue([]);
      jest.spyOn(TransportWebUSB, "create").mockResolvedValue({ setScrambleKey: jest.fn() } as any);

      const signer = await makeSigner({
        type: "ledger",
        network: MAINNET,
        account: { derivationPath: defaultDerivationPathTemplate, curve: "ed25519" },
      });

      expect(signer).toBeInstanceOf(LedgerSigner);
    });
  });

  test("deriveSecretKey", async () => {
    expect(await deriveSecretKey(mnemonic1, getDefaultDerivationPath(0), "ed25519")).toEqual(
      "edskRicpWcBughiZrP7jDEXse7gMSwa1HG6CEEHZa9y6eBYfpoAii3BqFdemgfpehhbGjxgkPpECxqcCQReGNLsAsh46TwGDEA"
    );
  });

  test("derivePublicKeyPair", async () => {
    expect(await derivePublicKeyPair(mnemonic1, getDefaultDerivationPath(0), "ed25519")).toEqual({
      pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
      pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    });

    expect(await derivePublicKeyPair(mnemonic1, getDefaultDerivationPath(0), "secp256k1")).toEqual({
      pk: "sppk7aVaRDWwyLRP3iL79sNavXktYCK8x3i7ywhZC9LAFiqyb4DvJNA",
      pkh: "tz2V1jhdHEHk1WdJyFjEqRKd1HSDXDHRs8RH",
    });
  });

  describe("getIPFSurl", () => {
    it("returns nothing if no URI is provided", () => {
      expect(getIPFSurl(undefined)).toBe(undefined);
    });

    it("converts an IPFS URI to an HTTP one", () => {
      expect(getIPFSurl("ipfs://some/image/uri")).toBe("https://ipfs.io/ipfs/some/image/uri");
    });
  });

  describe("decryptSecretKey", () => {
    const ENCRYPTED_SECRET_KEY =
      "edesk1GXwWmGjXiLHBKxGBxwmNvG21vKBh6FBxc4CyJ8adQQE2avP5vBB57ZUZ93Anm7i4k8RmsHaPzVAvpnHkFF";
    const UNENCRYPTED_SECRET_KEY =
      "edskRk1hRPhBCsGRDfqRBKDY5ecPKLfBhQDC4MvmWwa8i8dXUiGEyWJ7vUDjFo1k59PHfRrQKSEM9ieJNH3FbqrrDFg18ZZorh";

    it("returns the same key if it's not encrypted", async () => {
      await expect(decryptSecretKey(UNENCRYPTED_SECRET_KEY, "")).resolves.toEqual(
        UNENCRYPTED_SECRET_KEY
      );
    });

    it("returns the same key if it's not encrypted when arbitrary password is provided", async () => {
      await expect(decryptSecretKey(UNENCRYPTED_SECRET_KEY, "test pass")).resolves.toEqual(
        UNENCRYPTED_SECRET_KEY
      );
    });

    it("decrypts the key if it's encrypted", async () => {
      await expect(decryptSecretKey(ENCRYPTED_SECRET_KEY, "test")).resolves.toEqual(
        UNENCRYPTED_SECRET_KEY
      );
    });

    it("throws an error if the password is incorrect", async () => {
      await expect(decryptSecretKey(ENCRYPTED_SECRET_KEY, "wrong password")).rejects.toThrow(
        "Key-password pair is invalid"
      );
    });

    it("throws when the key is invalid", async () => {
      await expect(decryptSecretKey(UNENCRYPTED_SECRET_KEY + "asdasd", "")).rejects.toThrow(
        "Invalid secret key: checksum doesn't match"
      );
    });
  });
});
