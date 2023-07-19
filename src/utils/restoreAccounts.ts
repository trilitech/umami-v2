import { Curves, InMemorySigner } from "@taquito/signer";
import { MnemonicAccount } from "../types/Account";
import { defaultDerivationPathPattern, makeDerivationPath } from "./account/derivationPathUtils";
import { makeMnemonicAccount } from "./account/makeMnemonicAccount";
import { addressExists, getFingerPrint } from "./tezos";

export type PublicKeyPair = {
  pk: string;
  pkh: string;
};

export const restoreAccount = async (
  seedPhrase: string,
  derivationPath: string
): Promise<PublicKeyPair> => {
  const signer = InMemorySigner.fromMnemonic({
    mnemonic: seedPhrase,
    derivationPath,
    curve: "ed25519",
  });

  return {
    pkh: await signer.publicKeyHash(),
    pk: await signer.publicKey(),
  };
};

/**
 *
 * Use this to get SK for a mnemonic account.
 * Get the corresponding mnemonic via the fingerprint field
 */
export const deriveSkFromMnemonic = async (
  mnemonic: string,
  derivationPath: string,
  curve: Curves
) => {
  const signer = await InMemorySigner.fromMnemonic({
    mnemonic,
    derivationPath,
    curve,
  });

  return signer.secretKey();
};

export const restoreAccounts = async (
  seedPhrase: string,
  derivationPathPattern: string,
  result: PublicKeyPair[] = [],
  startIndex = 0
): Promise<PublicKeyPair[]> => {
  const derivationPath = makeDerivationPath(derivationPathPattern, startIndex);
  const account = await restoreAccount(seedPhrase, derivationPath);

  if (await addressExists(account.pkh)) {
    return restoreAccounts(seedPhrase, derivationPathPattern, [...result, account], startIndex + 1);
  } else {
    return result.length === 0 ? [account] : result;
  }
};

export const restoreMnemonicAccounts = async (
  seedPhrase: string,
  label = "Account",
  derivationPathPattern = defaultDerivationPathPattern
): Promise<MnemonicAccount[]> => {
  const accounts = await restoreAccounts(seedPhrase, derivationPathPattern);
  const seedFingerPrint = await getFingerPrint(seedPhrase);

  return accounts.map(({ pk, pkh }, i) => {
    return makeMnemonicAccount(
      pk,
      pkh,
      makeDerivationPath(derivationPathPattern, i),
      derivationPathPattern,
      seedFingerPrint,
      `${label}${accounts.length > 1 ? " " + i : ""}`
    );
  });
};
