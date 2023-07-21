import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { SignerType } from "../types/SignerConfig";
import { TezosNetwork } from "../types/TezosNetwork";
import { getDefaultDerivationPath } from "../utils/account/derivationPathUtils";
import { makeToolkitWithSigner } from "../utils/tezos";
import { seedPhrase } from "./seedPhrase";

// make the default signer used in the dev mode.
// e.g. makeDefaultDevSigner(0) is equivalent to the "restored account 0".
export const makeDefaultDevSigner = (index: number): InMemorySigner => {
  return InMemorySigner.fromMnemonic({
    mnemonic: seedPhrase,
    derivationPath: getDefaultDerivationPath(index),
    curve: "ed25519",
  });
};

export const makeDefaultDevSignerKeys = async (index: number) => {
  const signer = makeDefaultDevSigner(index);
  return {
    sk: await signer.secretKey(),
    pk: await signer.publicKey(),
    pkh: await signer.publicKeyHash(),
  };
};

// equivalnet to the publickeys of makeDefaultDevSignerKeys(0)
export const devPublicKeys0 = {
  pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
  pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
};

export const devPublicKeys1 = {
  pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
  pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
};

export const devPublicKeys2 = {
  pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
  pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
};

// Make the tezos toolkit with the default dev signer.
export const makeToolkitFromDefaultDevSeed = async (index: number): Promise<TezosToolkit> => {
  const { sk } = await makeDefaultDevSignerKeys(index);

  return makeToolkitWithSigner({
    sk,
    type: SignerType.SK,
    network: TezosNetwork.GHOSTNET,
  });
};
