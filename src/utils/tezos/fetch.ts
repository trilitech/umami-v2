import { TezosNetwork } from "@airgap/tezos";
import {
  blocksGetCount,
  DelegationOperation,
  operationsGetDelegations,
  operationsGetTransactions,
  Token,
  tokensGetTokenTransfers,
  TokenTransfer,
} from "@tzkt/sdk-api";
import axios from "axios";
import { bakersUrl, coincapUrl, nodeUrls, tzktUrls } from "./consts";
import { coinCapResponseType } from "./types";
import { tokensGetTokenBalances } from "@tzkt/sdk-api";
import { TezosToolkit } from "@taquito/taquito";
import { Baker } from "../../types/Baker";
import { TezTransfer } from "../../types/Operation";

export const getBalance = async (pkh: string, network: TezosNetwork) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  return Tezos.tz.getBalance(pkh);
};

export const getTokens = async (pkh: string, network: TezosNetwork): Promise<Token[]> =>
  tokensGetTokenBalances(
    {
      account: { eq: pkh },
      balance: { gt: "0" },
    },
    {
      baseUrl: tzktUrls[network],
    }
  );

export const getTezTransfers = (
  address: string,
  network = TezosNetwork.MAINNET
): Promise<TezTransfer[]> => {
  return operationsGetTransactions(
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
  return tokensGetTokenTransfers(
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

export const getLastDelegation = async (
  address: string,
  network = TezosNetwork.MAINNET
): Promise<DelegationOperation | undefined> => {
  return operationsGetDelegations(
    {
      sender: { eq: address },
      sort: { desc: "level" },
      limit: 1,
    },
    {
      baseUrl: tzktUrls[network],
    }
  ).then(d => d[0]);
};

// Fetch the tezos price in usd from the CoinCap API.
// The CoinCap API documentation: https://docs.coincap.io
export const getTezosPriceInUSD = async (): Promise<number | null> => {
  const {
    data: {
      data: { priceUsd },
    },
  } = await axios.get<coinCapResponseType>(`${coincapUrl}/tezos`);

  return priceUsd ?? null;
};

export const getLatestBlockLevel = async (network = TezosNetwork.MAINNET): Promise<number> => {
  return await blocksGetCount({
    baseUrl: tzktUrls[network],
  });
};

export const getBakers = async (): Promise<Baker[]> => {
  return axios.get<Baker[]>(bakersUrl).then(d => d.data);
};
