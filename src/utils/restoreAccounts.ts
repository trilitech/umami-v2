import { Curves, InMemorySigner } from "@taquito/signer";
import { MnemonicAccount, UnencryptedAccount } from "../types/Account";
import { makeMnemonicAccount } from "./account/makeMnemonicAccount";
import { getFullDerivationPath } from "./account/derivationPathUtils";
import { addressExists, getFingerPrint } from "./tezos";

export const restoreAccount = async (
  seedPhrase: string,
  derivationPathIndex = 0
) => {
  const derivationPath = getFullDerivationPath(derivationPathIndex);

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
  result: UnencryptedAccount[] = [],
  derivationPathIndex = 0
): Promise<UnencryptedAccount[]> => {
  const account = await restoreAccount(seedPhrase, derivationPathIndex);

  if (await addressExists(account.pkh)) {
    return restoreAccounts(
      seedPhrase,
      [...result, account],
      derivationPathIndex + 1
    );
  } else {
    return result.length === 0 ? [account] : result;
  }
};

export const restoreMnemonicAccounts = async (
  seedPhrase: string,
  label = "Account"
): Promise<MnemonicAccount[]> => {
  const accounts = await restoreAccounts(seedPhrase);
  const seedFingerPrint = await getFingerPrint(seedPhrase);

  return Promise.all(
    accounts.map(async ({ pk, pkh }, i) => {
      return makeMnemonicAccount(
        pk,
        pkh,
        i,
        seedFingerPrint,
        `${label || ""}${accounts.length > 1 ? " " + i : ""}`
      );
    })
  );
};
