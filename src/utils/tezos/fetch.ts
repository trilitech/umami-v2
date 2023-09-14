import {
  blocksGetCount,
  Delegate,
  DelegationOperation,
  operationsGetDelegations,
  operationsGetTransactions,
  tokensGetTokenTransfers,
  delegatesGet,
  TokenTransfer,
  operationsGetOriginations,
  TransactionOperation,
  OriginationOperation,
  OffsetParameter,
  SortParameter,
} from "@tzkt/sdk-api";
import axios from "axios";
import { coincapUrl } from "./consts";
import { coinCapResponseType } from "./types";
import { TezTransfer } from "../../types/Transfer";
import { RawTokenBalance } from "../../types/TokenBalance";
import { Network } from "../../types/Network";
import Semaphore from "@chriscdn/promise-semaphore";
import promiseRetry from "promise-retry";
import { RawPkh } from "../../types/Address";
import { sortBy } from "lodash";

// TzKT defines type Account = {type: string};
// whilst accountsGet returns all the info about accounts
// for now we need only the balance, but we can extend it later
export type TzktAccount = { address: RawPkh; balance: number };

const tzktRateLimiter = new Semaphore(10);

export const withRateLimit = <T>(fn: () => Promise<T>) =>
  tzktRateLimiter
    .acquire()
    .then(() => promiseRetry(fn, { retries: 3, minTimeout: 100 }))
    .finally(() => tzktRateLimiter.release());

export const getAccounts = async (pkhs: string[], network: Network): Promise<TzktAccount[]> =>
  withRateLimit(async () => {
    const response = await axios.get<TzktAccount[]>(
      `${network.tzktApiUrl}/v1/accounts?address.in=${pkhs.join(",")}&select=address,balance`
    );
    return response.data;
  });

export const getTokenBalances = async (
  pkhs: string[],
  network: Network
): Promise<RawTokenBalance[]> =>
  withRateLimit(async () => {
    const response = await axios.get<RawTokenBalance[]>(
      `${network.tzktApiUrl}/v1/tokens/balances?account.in=${pkhs.join(",")}&balance.gt=0`
    );
    return response.data;
  });

// TODO: remove it when transition to combined operations is done
export const getTezTransfers = (address: RawPkh, network: Network): Promise<TezTransfer[]> =>
  withRateLimit(() =>
    operationsGetTransactions(
      {
        anyof: { fields: ["sender", "target"], eq: address },
        sort: { desc: "level" },
        limit: 10,
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  );

export const getDelegations = async (
  addresses: RawPkh[],
  network: Network,
  options: {
    offset?: OffsetParameter;
    sort: SortParameter;
    limit: number;
  }
): Promise<DelegationOperation[]> =>
  withRateLimit(() =>
    operationsGetDelegations(
      { sender: { in: [addresses.join(",")] }, ...options },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  );

export const getTransactions = async (
  addresses: RawPkh[],
  network: Network,
  options: {
    offset?: OffsetParameter;
    sort: SortParameter;
    limit: number;
  }
): Promise<DelegationOperation[]> =>
  withRateLimit(() =>
    operationsGetTransactions(
      {
        anyof: { fields: ["sender", "target"], in: [addresses.join(",")] },
        ...options,
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  );

export const getOriginations = async (
  addresses: RawPkh[],
  network: Network,
  options: {
    offset?: OffsetParameter;
    sort: SortParameter;
    limit: number;
  }
): Promise<DelegationOperation[]> =>
  withRateLimit(() =>
    operationsGetOriginations(
      { sender: { in: [addresses.join(",")] }, ...options },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  );

export type TzktCombinedOperation =
  | DelegationOperation
  | TransactionOperation
  | OriginationOperation;

export const getCombinedOperations = async (
  addresses: RawPkh[],
  network: Network,
  options?: {
    lastId?: number;
    limit?: number;
    sort?: "asc" | "desc";
  }
): Promise<TzktCombinedOperation[]> => {
  const limit = options?.limit || 1;
  const tzktRequestOptions = {
    limit,
    offset: options?.lastId ? { cr: options.lastId } : undefined,
    sort: { [options?.sort ?? "desc"]: "id" },
  };

  const operations = await Promise.all([
    getTransactions(addresses, network, tzktRequestOptions),
    getDelegations(addresses, network, tzktRequestOptions),
    getOriginations(addresses, network, tzktRequestOptions),
  ]);

  // ID is a shared sequence among all operations in TzKT
  // so it's safe to use it for sorting & pagination
  return sortBy(operations.flat(), op => op.id)
    .reverse() // TODO: add an option to sort asc too
    .slice(0, limit);
};

export const getTokenTransfers = (address: RawPkh, network: Network): Promise<TokenTransfer[]> =>
  withRateLimit(() =>
    tokensGetTokenTransfers(
      {
        anyof: { fields: ["from", "to"], eq: address },
        sort: { desc: "level" },
        limit: 10,
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  );

export const getLastDelegation = async (
  address: RawPkh,
  network: Network
): Promise<DelegationOperation | undefined> =>
  withRateLimit(() =>
    operationsGetDelegations(
      {
        sender: { eq: address },
        sort: { desc: "level" },
        limit: 1,
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    ).then(d => d[0])
  );

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

export const getLatestBlockLevel = async (network: Network): Promise<number> =>
  withRateLimit(async () => {
    return await blocksGetCount({
      baseUrl: network.tzktApiUrl,
    });
  });

export const getBakers = async (network: Network): Promise<Delegate[]> =>
  withRateLimit(() =>
    delegatesGet(
      {
        sort: { desc: "stakingBalance" },
        active: { eq: true },
        limit: 10000,
        select: { fields: ["address,alias,stakingBalance"] },
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  );
