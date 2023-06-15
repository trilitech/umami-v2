import { Curves, InMemorySigner } from "@taquito/signer";
import { MnemonicAccount, UnencryptedAccount } from "../types/Account";
import { defaultV1Pattern, makeDerivationPath } from "./account/derivationPathUtils";
import { makeMnemonicAccount } from "./account/makeMnemonicAccount";
import { addressExists, getFingerPrint } from "./tezos";

export const restoreAccount = async (seedPhrase: string, derivationPath: string) => {
  const signer = await InMemorySigner.fromMnemonic({
    mnemonic: seedPhrase,
    derivationPath,
    curve: "ed25519",
  });
  const pkh = await signer.publicKeyHash();
  const pk = await signer.publicKey();

  const result: UnencryptedAccount = {
    pk,
    pkh,
  };
  return result;
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
  result: UnencryptedAccount[] = [],
  startIndex = 0
): Promise<UnencryptedAccount[]> => {
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
  derivationPathPattern = defaultV1Pattern
): Promise<MnemonicAccount[]> => {
  const accounts = await restoreAccounts(seedPhrase, derivationPathPattern);
  const seedFingerPrint = await getFingerPrint(seedPhrase);

  return Promise.all(
    accounts.map(async ({ pk, pkh }, i) => {
      return makeMnemonicAccount(
        pk,
        pkh,
        makeDerivationPath(derivationPathPattern, i),
        seedFingerPrint,
        `${label || ""}${accounts.length > 1 ? " " + i : ""}`
      );
    })
  );
};
