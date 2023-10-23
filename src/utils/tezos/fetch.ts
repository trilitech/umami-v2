import {
  blocksGetCount,
  Delegate,
  operationsGetDelegations,
  operationsGetTransactions,
  tokensGetTokenTransfers,
  delegatesGet,
  operationsGetOriginations,
  OffsetParameter,
  SortParameter,
  accountsGet,
} from "@tzkt/sdk-api";
import * as tzktApi from "@tzkt/sdk-api";
import axios from "axios";
import { coincapUrl } from "./consts";
import { coinCapResponseType } from "./types";
import { TokenTransfer } from "../../types/Transfer";
import { RawTokenBalance } from "../../types/TokenBalance";
import { Network } from "../../types/Network";
import Semaphore from "@chriscdn/promise-semaphore";
import promiseRetry from "promise-retry";
import { RawPkh, TzktAlias } from "../../types/Address";
import { first, sortBy } from "lodash";
import { tokensGetTokenBalances } from "@tzkt/sdk-api";

// TzKT defines type Account = {type: string};
// whilst accountsGet returns all the info about accounts
export type TzktAccount = { address: RawPkh; balance: number; delegationLevel?: number };

const tzktRateLimiter = new Semaphore(10);

export const withRateLimit = <T>(fn: () => Promise<T>) =>
  tzktRateLimiter
    .acquire()
    .then(() => promiseRetry(fn, { retries: 3, minTimeout: 100 }))
    .finally(() => tzktRateLimiter.release());

export type DelegationOperation = tzktApi.DelegationOperation & {
  id: number;
  level: number;
  hash: string;
  counter: number;
  type: "delegation";
  sender: TzktAlias;
};
export type TransactionOperation = tzktApi.TransactionOperation & {
  id: number;
  level: number;
  hash: string;
  counter: number;
  type: "transaction";
  sender: TzktAlias;
  target: TzktAlias;
};
export type OriginationOperation = tzktApi.OriginationOperation & {
  id: number;
  level: number;
  hash: string;
  counter: number;
  type: "origination";
  sender: TzktAlias;
};

// outgoing token transfers are represented as transactions + corresponding token transfers
export type IncomingTokenTransferOperation = TokenTransfer & {
  type: "incoming_token_transfer";
  // transfers initiated by the user take the status from the corresponding operation
  // for incoming transfers it should be safe to assume that they are applied for now
  // but if we want to be precise, we'd need to fetch the corresponding operations
  status: "applied";
  sender?: TzktAlias;
  target: TzktAlias;
};

export type TzktCombinedOperation =
  | DelegationOperation
  | TransactionOperation
  | OriginationOperation
  | IncomingTokenTransferOperation;

export const getAccounts = async (pkhs: string[], network: Network) =>
  withRateLimit(() =>
    accountsGet(
      {
        address: { in: [pkhs.join(",")] },
        select: { fields: ["address,balance,delegationLevel"] },
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  ) as any as Promise<TzktAccount[]>;

export const getTokenBalances = async (pkhs: string[], network: Network) =>
  withRateLimit(() =>
    tokensGetTokenBalances(
      {
        account: { in: [pkhs.join(",")] },
        balance: { gt: "0" },
        limit: 10000,
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  ) as Promise<RawTokenBalance[]>;

type OperationFetchOptions = {
  offset?: OffsetParameter;
  sort: SortParameter;
  limit: number;
};

export const getIncomingTokenTransfers = (
  addresses: RawPkh[],
  network: Network,
  options: OperationFetchOptions
): Promise<IncomingTokenTransferOperation[]> =>
  withRateLimit(async () => {
    const rawTransfers = await tokensGetTokenTransfers(
      {
        to: { in: [addresses.join(",")] },
        ...options,
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    );

    return (rawTransfers as TokenTransfer[]).map(transfer => ({
      ...transfer,
      target: transfer.to,
      sender: transfer.from,
      type: "incoming_token_transfer",
      status: "applied",
    }));
  });

export const getDelegations = async (
  addresses: RawPkh[],
  network: Network,
  options: OperationFetchOptions
) =>
  withRateLimit(() =>
    operationsGetDelegations(
      { sender: { in: [addresses.join(",")] }, ...options },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  ) as Promise<DelegationOperation[]>;

export const getTransactions = async (
  addresses: RawPkh[],
  network: Network,
  options: OperationFetchOptions
) =>
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
  ) as Promise<DelegationOperation[]>;

export const getOriginations = async (
  addresses: RawPkh[],
  network: Network,
  options: OperationFetchOptions
) =>
  withRateLimit(() =>
    operationsGetOriginations(
      { sender: { in: [addresses.join(",")] }, ...options },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  ) as Promise<DelegationOperation[]>;

export const getCombinedOperations = async (
  addresses: RawPkh[],
  network: Network,
  options?: {
    lastId?: number;
    limit?: number;
    sort?: "asc" | "desc";
  }
): Promise<TzktCombinedOperation[]> => {
  const limit = options?.limit || 100;
  const sort = options?.sort ?? "desc";
  const tzktRequestOptions = {
    limit,
    offset: options?.lastId ? { cr: options.lastId } : undefined,
    sort: { [sort]: "id" },
  };

  const operations = await Promise.all([
    getTransactions(addresses, network, tzktRequestOptions),
    getDelegations(addresses, network, tzktRequestOptions),
    getOriginations(addresses, network, tzktRequestOptions),
    getIncomingTokenTransfers(addresses, network, tzktRequestOptions),
  ]);

  // ID is a shared sequence among all operations in TzKT
  // so it's safe to use it for sorting & pagination
  return sortBy(
    operations.flat(),
    operation => (sort === "asc" ? operation.id : -operation.id) // operation#id is always defined
  ).slice(0, limit) as TzktCombinedOperation[];
};

export const getTokenTransfersFor = async (transactionIds: number[], network: Network) => {
  if (transactionIds.length === 0) {
    return [];
  }
  return withRateLimit(() =>
    tokensGetTokenTransfers(
      // tzkt doesn't work with the `in` operator correctly
      // the only way is to have just one element in it and join it with a comma manually
      { transactionId: { in: [transactionIds.join(",")] as any } },
      { baseUrl: network.tzktApiUrl }
    )
  ) as Promise<TokenTransfer[]>;
};

export const getLastDelegation = (address: RawPkh, network: Network) =>
  getDelegations([address], network, { limit: 1, sort: { desc: "id" } }).then(first);

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
