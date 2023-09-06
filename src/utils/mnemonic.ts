import { Curves, InMemorySigner } from "@taquito/signer";
import { MnemonicAccount } from "../types/Account";
import { defaultDerivationPathPattern, makeDerivationPath } from "./account/derivationPathUtils";
import { makeMnemonicAccount } from "./account/makeMnemonicAccount";
import { addressExists, getFingerPrint } from "./tezos";
import { generateMnemonic } from "bip39";
import { Network } from "../types/Network";

// This is put in a separate file for mocking purposes in tests
export const generate24WordMnemonic = () => {
  return generateMnemonic(256);
};

export type PublicKeyPair = {
  pk: string;
  pkh: string;
};

export const derivePublicKeyPair = async (
  mnemonic: string,
  derivationPath: string
): Promise<PublicKeyPair> => {
  const signer = InMemorySigner.fromMnemonic({
    mnemonic,
    derivationPath,
    curve: "ed25519",
  });

  return {
    pkh: await signer.publicKeyHash(),
    pk: await signer.publicKey(),
  };
};

export const deriveSecretKey = (mnemonic: string, derivationPath: string, curve: Curves) =>
  InMemorySigner.fromMnemonic({
    mnemonic,
    derivationPath,
    curve,
  }).secretKey();

export const restoreRevealedPublickKeyPairs = async (
  mnemonic: string,
  derivationPathPattern: string,
  network: Network,
  result: PublicKeyPair[] = [],
  startIndex = 0
): Promise<PublicKeyPair[]> => {
  const derivationPath = makeDerivationPath(derivationPathPattern, startIndex);
  const pubKeyPair = await derivePublicKeyPair(mnemonic, derivationPath);

  if (await addressExists(pubKeyPair.pkh, network)) {
    return restoreRevealedPublickKeyPairs(
      mnemonic,
      derivationPathPattern,
      network,
      [...result, pubKeyPair],
      startIndex + 1
    );
  } else {
    return result.length === 0 ? [pubKeyPair] : result;
  }
};

export const restoreRevealedMnemonicAccounts = async (
  mnemonic: string,
  network: Network,
  label = "Account",
  derivationPathPattern = defaultDerivationPathPattern
): Promise<MnemonicAccount[]> => {
  const pubKeyPairs = await restoreRevealedPublickKeyPairs(
    mnemonic,
    derivationPathPattern,
    network
  );
  const seedFingerPrint = await getFingerPrint(mnemonic);

  return pubKeyPairs.map(({ pk, pkh }, i) => {
    return makeMnemonicAccount(
      pk,
      pkh,
      makeDerivationPath(derivationPathPattern, i),
      derivationPathPattern,
      seedFingerPrint,
      `${label}${pubKeyPairs.length > 1 ? " " + i : ""}`
    );
  });
};
