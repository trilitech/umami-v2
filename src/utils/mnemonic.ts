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

/**
 * Finds revealed public key pairs matching the given {@link derivationPathPattern}.
 *
 * Checks matching public key pairs starting from index = 0.
 * If a key pair was revealed, it will be added to response and the next index will be checked.
 *
 * Once an index for unrevealed key pair is found, the process stops,
 * even though there might be more revealed accounts with bigger indexes.
 *
 * At least one {@link PublicKeyPair} will be added in any case.
 * If no accounts were revealed, account with the smallest derivation path (index = 0) will be added.
 *
 * @param mnemonic - Space separated words making a BIP39 seed phrase.
 * @param derivationPathPattern - Path pattern for searching for the key pairs.
 * @returns List of revealed <@link PublicKeyPair> associated with the given parameters.
 */
export const restoreRevealedPublicKeyPairs = async (
  mnemonic: string,
  derivationPathPattern: string,
  network: Network
): Promise<PublicKeyPair[]> => {
  const result: PublicKeyPair[] = [];
  let accountIndex = 0;
  let pubKeyPair = await derivePublicKeyPair(
    mnemonic,
    makeDerivationPath(derivationPathPattern, accountIndex)
  );
  do {
    result.push(pubKeyPair);
    accountIndex += 1;
    pubKeyPair = await derivePublicKeyPair(
      mnemonic,
      makeDerivationPath(derivationPathPattern, accountIndex)
    );
  } while (await addressExists(pubKeyPair.pkh, network));
  return result;
};

/**
 * Restores accounts from a mnemonic group whet it's being added by an existing seedphrase.
 *
 * Creates some revealed mnemonic accounts matching given {@link derivationPathPattern},
 * or, if no accounts were revealed, an account with the smallest derivation path (accountIndex = 0).
 *
 * Check {@link restoreRevealedPublicKeyPairs} for logic of restoring revealed accounts.
 *
 * @param mnemonic - Space separated words making a BIP39 seed phrase.
 * @param network - Stores Tezos network & tzkt indexer settings.
 * @param label - Account group prefix provided by the user.
 * @param derivationPathPattern - Path pattern for the account group that's being added.
 * @returns A list of revealed mnemonic accounts that will be added.
 */
export const restoreRevealedMnemonicAccounts = async (
  mnemonic: string,
  network: Network,
  label = "Account",
  derivationPathPattern = defaultDerivationPathPattern
): Promise<MnemonicAccount[]> => {
  const pubKeyPairs = await restoreRevealedPublicKeyPairs(mnemonic, derivationPathPattern, network);
  const seedFingerPrint = await getFingerPrint(mnemonic);

  return pubKeyPairs.map(({ pk, pkh }, accountIndex) => {
    return makeMnemonicAccount(
      pk,
      pkh,
      makeDerivationPath(derivationPathPattern, accountIndex),
      derivationPathPattern,
      seedFingerPrint,
      `${label}${pubKeyPairs.length > 1 ? " " + accountIndex : ""}`
    );
  });
};
