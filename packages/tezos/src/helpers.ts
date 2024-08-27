import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { DerivationType, LedgerSigner } from "@taquito/ledger-signer";
import { Parser } from "@taquito/michel-codec";
import { type Curves, InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";

import { FakeSigner } from "./fakeSigner";
import { type PublicKeyPair, type SignerConfig } from "./types";

// Temporary solution for generating fingerprint for seedphrase
// https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
export const getFingerPrint = async (seedPhrase: string): Promise<string> => {
  const utf8 = new TextEncoder().encode(seedPhrase);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(bytes => bytes.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 8);
  return hashHex;
};

export const curveToDerivationType = (curve: Curves): DerivationType => {
  switch (curve) {
    case "ed25519":
      return DerivationType.ED25519;
    case "secp256k1":
      return DerivationType.SECP256K1;
    case "p256":
      return DerivationType.P256;
    case "bip25519":
      throw new Error("bip25519 is not supported in Tezos");
  }
};

export const makeSigner = async (config: SignerConfig) => {
  switch (config.type) {
    case "social":
    case "mnemonic":
    case "secret_key":
      return new InMemorySigner(config.secretKey);
    case "ledger": {
      // Close existing connections to be able to re-initiate
      const devices = await TransportWebUSB.list();
      for (let i = 0; i < devices.length; i++) {
        devices[i].close();
      }
      const transport = await TransportWebUSB.create();
      const signer = new LedgerSigner(
        transport,
        config.account.derivationPath,
        false, // PK Verification not needed
        curveToDerivationType(config.account.curve)
      );
      return signer;
    }
    case "fake":
      return new FakeSigner(config.signer.pk, config.signer.address.pkh);
  }
};

export const makeToolkit = async (config: SignerConfig) => {
  const toolkit = new TezosToolkit(config.network.rpcUrl);
  const signer = await makeSigner(config);
  toolkit.setSignerProvider(signer);
  return toolkit;
};

export const getPublicKeyPairFromSk = async (sk: string): Promise<PublicKeyPair> => {
  const signer = new InMemorySigner(sk);
  return { pk: await signer.publicKey(), pkh: await signer.publicKeyHash() };
};

export const derivePublicKeyPair = async (
  mnemonic: string,
  derivationPath: string,
  curve: Curves
): Promise<PublicKeyPair> =>
  deriveSecretKey(mnemonic, derivationPath, curve).then(getPublicKeyPairFromSk);

export const deriveSecretKey = (mnemonic: string, derivationPath: string, curve: Curves) =>
  InMemorySigner.fromMnemonic({
    mnemonic,
    derivationPath,
    curve,
  }).secretKey();

export const isValidMichelson = (object: any): boolean => {
  try {
    new Parser().parseJSON(object);
    return true;
  } catch {
    return false;
  }
};

export const getLedgerPublicKeyPair = async (derivationPath?: string): Promise<PublicKeyPair> => {
  const transport = await TransportWebUSB.create();
  const ledgerSigner = new LedgerSigner(transport, derivationPath, true);
  const pk = await ledgerSigner.publicKey();
  const pkh = await ledgerSigner.publicKeyHash();
  await transport.close();
  return { pk, pkh };
};

export const getIPFSurl = (ipfsPath?: string) =>
  ipfsPath?.replace("ipfs://", "https://ipfs.io/ipfs/");

// todo: test
export const decryptSecretKey = async (secretKey: string, password: string) => {
  try {
    const signer = await InMemorySigner.fromSecretKey(secretKey.trim(), password);
    return await signer.secretKey();
  } catch (error: any) {
    const message = error.message || "";

    // if the password doesn't match taquito throws this error
    if (message.includes("Cannot read properties of null")) {
      throw new Error("Key-password pair is invalid");
    }

    if (message.includes("Invalid checksum")) {
      throw new Error("Invalid secret key: checksum doesn't match");
    }

    throw error;
  }
};
