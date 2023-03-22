import { TezosIndexerClient, TezosNetwork } from "@airgap/tezos";
import { TezosToolkit } from "@taquito/taquito";
import { Operation } from "../types/Operation";

import * as tzktApi from "@tzkt/sdk-api";
import { Token } from "../types/Token";

let nodeUrls = {
  [TezosNetwork.GHOSTNET]: `https://ghostnet.ecadinfra.com`,
  [TezosNetwork.MAINNET]: `https://mainnet.api.tez.ie`,
};

let tzktUrls = {
  [TezosNetwork.GHOSTNET]: `https://api.ghostnet.tzkt.io`,
  [TezosNetwork.MAINNET]: `https://api.mainnet.tzkt.io`,
};

export const addressExists = async (
  pkh: string,
  network = TezosNetwork.MAINNET
) => {
  // Temporary solution to check address existence
  const Tezos = new TezosToolkit(nodeUrls[network]);
  const balance = await Tezos.tz.getBalance(pkh);
  return !balance.isZero();
};

export const getBalance = async (
  pkh: string,
  network = TezosNetwork.MAINNET
) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  return Tezos.tz.getBalance(pkh);
};

const indexerClients = {
  [TezosNetwork.GHOSTNET]: new TezosIndexerClient(
    tzktUrls[TezosNetwork.GHOSTNET]
  ),
  [TezosNetwork.MAINNET]: new TezosIndexerClient(
    tzktUrls[TezosNetwork.MAINNET]
  ),
};

export const getOperations = (
  pkh: string,
  network = TezosNetwork.MAINNET
): Promise<Operation> => {
  return indexerClients[network].getTransactions(pkh);
};

export const getTokens = (pkh: string, network: TezosNetwork) =>
  tzktApi.tokensGetTokenBalances(
    {
      account: { eq: pkh },
    },
    {
      baseUrl: tzktUrls[network],
    }
  ) as Promise<Token[]>;

// Temporary solution for generating fingerprint for seedphrase
// https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
export async function getFingerPrint(seedPhrase: string) {
  const utf8 = new TextEncoder().encode(seedPhrase);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
