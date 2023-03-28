import { TezosIndexerClient, TezosNetwork } from "@airgap/tezos";
import { Signer, TezosToolkit } from "@taquito/taquito";
import { Operation, TezTransfer, TokenTransfer } from "../types/Operation";

import * as tzktApi from "@tzkt/sdk-api";
import { Token } from "../types/Token";
import { DummySigner } from "./dummySigner";
import { InMemorySigner } from "@taquito/signer";
import { UmamiEncrypted } from "../types/UmamiEncrypted";
import { decrypt } from "./aes";
import axios from "axios";

let nodeUrls = {
  [TezosNetwork.GHOSTNET]: `https://ghostnet.ecadinfra.com`,
  [TezosNetwork.MAINNET]: `https://mainnet.api.tez.ie`,
};

let tzktUrls = {
  [TezosNetwork.GHOSTNET]: `https://api.ghostnet.tzkt.io`,
  [TezosNetwork.MAINNET]: `https://api.mainnet.tzkt.io`,
};

const coincapUrl = "https://api.coincap.io/v2/assets";

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

export const estimate = async (
  network = TezosNetwork.MAINNET,
  senderPkh: string,
  senderPk: string,
  recipient: string,
  amount: number
) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  Tezos.setProvider({
    signer: new DummySigner(senderPk, senderPkh) as any as Signer,
  });

  return Tezos.estimate.transfer({
    to: recipient,
    amount: amount,
  });
};

export const transfer = async (
  network = TezosNetwork.MAINNET,
  senderEsk: UmamiEncrypted,
  recipient: string,
  amount: number,
  password: string
) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  const sk = await decrypt(senderEsk, password);
  Tezos.setProvider({
    signer: new InMemorySigner(sk),
  });

  return Tezos.contract.transfer({ to: recipient, amount });
};

export const getTezTransfers = (
  address: string,
  network = TezosNetwork.MAINNET
): Promise<TezTransfer[]> => {
  return tzktApi.operationsGetTransactions(
    {
      anyof: { fields: ["sender", "target"], eq: address },
      sort: { desc: "level" },
      limit: 10,
    },
    {
      baseUrl: tzktUrls[network],
    }
  );
};

export const getTokenTransfers = (
  address: string,
  network = TezosNetwork.MAINNET
): Promise<TokenTransfer[]> => {
  return tzktApi.tokensGetTokenTransfers(
    {
      anyof: { fields: ["from", "to"], eq: address },
      sort: { desc: "level" },
      limit: 10,
    },
    {
      baseUrl: tzktUrls[network],
    }
  );
};
// Fetch the tezos price in usd from the CoinCap API.
// The CoinCap API documentation: https://docs.coincap.io
export const getTezosPriceInUSD = async (): Promise<number | null> => {
  type coinCapResponseType = {
    data: {
      priceUsd?: number;
    };
  };

  const {
    data: {
      data: { priceUsd },
    },
  } = await axios<coinCapResponseType>({
    method: "get",
    url: `${coincapUrl}/tezos`,
  });

  return priceUsd ?? null;
};
