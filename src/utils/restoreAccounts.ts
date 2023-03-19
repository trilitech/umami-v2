import { InMemorySigner } from "@taquito/signer";
import { b58cencode, Prefix, prefix } from "@taquito/utils";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { UnencryptedAccount } from "../types/Account";
import { addressExists } from "./tezos";

let getDerivationPath = (index: number) => `m/44'/1729'/${index}'/0'`;

export const restoreAccount = async (
  seedPhrase: string,
  derivationPathIndex = 0
) => {
  const seed = (await mnemonicToSeed(seedPhrase)).toString("hex");

  const derivationPath = getDerivationPath(derivationPathIndex);
  const { key } = derivePath(derivationPath, seed);

  const b58encodedSecret = b58cencode(key, prefix[Prefix.EDSK2]);

  const signer = await InMemorySigner.fromSecretKey(b58encodedSecret);
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
