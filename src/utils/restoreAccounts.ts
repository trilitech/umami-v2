import { Curves, InMemorySigner } from "@taquito/signer";
import {
  AccountType,
  MnemonicAccount,
  UnencryptedAccount,
} from "../types/Account";
import { addressExists, getFingerPrint } from "./tezos";

export const getDerivationPath = (index: number) => `m/44'/1729'/${index}'/0'`;

export const restoreAccount = async (
  seedPhrase: string,
  derivationPathIndex = 0
) => {
  const derivationPath = getDerivationPath(derivationPathIndex);

  const signer = await InMemorySigner.fromMnemonic({
    mnemonic: seedPhrase,
    derivationPath,
    curve: "ed25519",
  });
  const pkh = await signer.publicKeyHash();
  const pk = await signer.publicKey();
  const sk = await signer.secretKey();

  const result: UnencryptedAccount = {
    pk,
    sk,
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
    accounts.map(async ({ pk, pkh, sk }, i) => {
      return {
        curve: "ed25519",
        derivationPath: getDerivationPath(i),
        pk,
        pkh,
        seedFingerPrint,
        label: `${label || ""}${accounts.length > 1 ? " " + i : ""}`,
        type: AccountType.MNEMONIC,
      };
    })
  );
};
