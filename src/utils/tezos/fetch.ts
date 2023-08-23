import {
  blocksGetCount,
  Delegate,
  DelegationOperation,
  operationsGetDelegations,
  operationsGetTransactions,
  tokensGetTokenTransfers,
  delegatesGet,
  TokenTransfer,
} from "@tzkt/sdk-api";
import axios from "axios";
import { coincapUrl, tzktUrls } from "./consts";
import { coinCapResponseType } from "./types";
import { TezTransfer } from "../../types/Transfer";
import { RawTokenBalance } from "../../types/TokenBalance";
import { TezosNetwork } from "../../types/TezosNetwork";

// TzKT defines type Account = {type: string};
// whilst accountsGet returns all the info about accounts
// for now we need only the balance, but we can extend it later
export type TzktAccount = { address: string; balance: number };

export const getAccounts = async (
  pkhs: string[],
  network: TezosNetwork
): Promise<TzktAccount[]> => {
  const response = await axios.get<TzktAccount[]>(
    `${tzktUrls[network]}/v1/accounts?address.in=${pkhs.join(",")}&select=address,balance`
  );
  return response.data;
};

export const getTokenBalances = async (
  pkhs: string[],
  network: TezosNetwork
): Promise<RawTokenBalance[]> => {
  const response = await axios.get<RawTokenBalance[]>(
    `${tzktUrls[network]}/v1/tokens/balances?account.in=${pkhs.join(",")}&balance.gt=0`
  );
  return response.data;
};

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

export const getBakers = async (network: TezosNetwork): Promise<Delegate[]> => {
  return delegatesGet(
    {
      sort: { desc: "stakingBalance" },
      active: { eq: true },
      limit: 10000,
      select: { fields: ["address,alias,stakingBalance"] },
    },
    {
      baseUrl: tzktUrls[network],
    }
  );
};
