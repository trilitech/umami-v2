import { TezosNetwork } from "@airgap/tezos";
import { Signer, TezosToolkit } from "@taquito/taquito";
import { TezTransfer, TokenTransfer } from "../types/Operation";

import { InMemorySigner } from "@taquito/signer";
import * as tzktApi from "@tzkt/sdk-api";
import axios from "axios";
import { Token } from "../types/Token";
import { UmamiEncrypted } from "../types/UmamiEncrypted";
import { decrypt } from "./aes";
import { DummySigner } from "./dummySigner";

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

const makeToolkitWithSigner = async (
  esk: UmamiEncrypted,
  password: string,
  network: TezosNetwork
) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  const sk = await decrypt(esk, password);
  Tezos.setProvider({
    signer: new InMemorySigner(sk),
  });
  return Tezos;
};

/**
 * Fetch balances
 */
export const getBalance = async (pkh: string, network: TezosNetwork) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  return Tezos.tz.getBalance(pkh);
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

type FA2TokenTransferParams = {
  sender: string;
  recipient: string;
  contract: string;
  tokenId: string;
  amount: number;
};

/**
 *  Contract factory
 */
const makeContract = async (
  { sender, recipient, tokenId, amount, contract }: FA2TokenTransferParams,
  toolkit: TezosToolkit
) => {
  const michelson = [
    {
      from_: sender,
      txs: [
        {
          to_: recipient,
          token_id: tokenId,
          amount: amount,
        },
      ],
    },
  ];

  const contractInstance = await toolkit.contract.at(contract);
  return contractInstance.methods.transfer(michelson);
};

/**
 * Estimation methods
 */
export const estimateTezTransfer = async (
  senderPkh: string,
  recipient: string,
  amount: number,
  senderPk: string,
  network: TezosNetwork
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

export const estimateFA2transfer = async (
  params: FA2TokenTransferParams,
  senderPk: string,
  network: TezosNetwork
) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  Tezos.setProvider({
    signer: new DummySigner(senderPk, params.sender) as any as Signer,
  });

  const contractInstance = await makeContract(params, Tezos);
  return Tezos.estimate.transfer(contractInstance.toTransferParams());
};

/**
 * Transfer execution methods
 */
export const transferFA2Token = async (
  network: TezosNetwork,
  params: FA2TokenTransferParams,
  esk: UmamiEncrypted,
  password: string
) => {
  const Tezos = await makeToolkitWithSigner(esk, password, network);

  const contractInstance = await makeContract(params, Tezos);
  return contractInstance.send();
};

export const transferTez = async (
  recipient: string,
  amount: number,
  senderEsk: UmamiEncrypted,
  password: string,
  network: TezosNetwork
) => {
  const Tezos = await makeToolkitWithSigner(senderEsk, password, network);
  return Tezos.contract.transfer({ to: recipient, amount });
};

/**
 *  Fetch tez and token transfers
 */
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
