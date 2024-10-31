import {
  type Delegate,
  type OffsetParameter,
  type SortParameter,
  blocksGet,
  delegatesGet,
  operationsGetByHash,
  operationsGetDelegations,
  operationsGetOriginations,
  operationsGetTransactions,
  tokensGetTokenBalances,
  tokensGetTokenTransfers,
} from "@tzkt/sdk-api";
import * as tzktApi from "@tzkt/sdk-api";
import { type Network, type RawPkh } from "@umami/tezos";
import { identity, pickBy, sortBy } from "lodash";

import {
  type DelegationOperation,
  type OriginationOperation,
  type RawTzktBlock,
  type RawTzktTokenBalance,
  type RawTzktTokenTransfer,
  type RawTzktUnstakeRequest,
  type StakingOperation,
  type TokenTransferOperation,
  type TransactionOperation,
  type TzktCombinedOperation,
} from "./types";
import { withRateLimit } from "./withRateLimit";

export const getAccounts = async (pkhs: string[], network: Network) =>
  withRateLimit(() =>
    fetch(
      `${network.tzktApiUrl}/v1/accounts?${new URLSearchParams({
        ["address.in"]: pkhs.join(","),
        ["select.fields"]:
          "address,balance,delegate,stakedBalance,unstakedBalance,rollupBonds,smartRollupBonds",
      })}`
    ).then(res => res.json())
  );

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
  ) as Promise<RawTzktTokenBalance[]>;

export const getDelegations = async (
  addresses: RawPkh[],
  network: Network,
  options: {
    offset?: OffsetParameter;
    sort: SortParameter;
    limit: number;
  }
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
  options: {
    offset?: OffsetParameter;
    sort: SortParameter;
    limit: number;
  }
) =>
  withRateLimit(() =>
    operationsGetTransactions(
      {
        anyof: { fields: ["sender", "target", "initiator"], in: [addresses.join(",")] },
        ...options,
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  ) as Promise<TransactionOperation[]>;

export const getOriginations = async (
  addresses: RawPkh[],
  network: Network,
  options: {
    offset?: OffsetParameter;
    sort: SortParameter;
    limit: number;
  }
) =>
  withRateLimit(() =>
    operationsGetOriginations(
      { sender: { in: [addresses.join(",")] }, ...options },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  ) as Promise<OriginationOperation[]>;

export const getStakingOperations = async (
  addresses: RawPkh[],
  network: Network,
  options: {
    offset?: OffsetParameter;
    sort: SortParameter;
    limit: number;
  }
): Promise<StakingOperation[]> =>
  withRateLimit(async () => {
    const params = pickBy(
      {
        limit: options.limit,
        "sender.in": addresses.join(","),
        "sort.asc": options.sort.asc,
        "sort.desc": options.sort.desc,
        "offset.cr": options.offset?.cr,
        // TODO: add select.fields
      },
      identity
    );
    const response = await fetch(
      `${network.tzktApiUrl}/v1/operations/staking?${new URLSearchParams(params as any)}`
    );
    const data = await response.json();
    return data.map(
      (operation: any) => ({ ...operation, type: operation.action }) as StakingOperation
    );
  });

// It returns all transactions, delegations, contract originations & token transfers for given addresses
// You will get them interleaved and  sorted by ID and up to the specified limit (100 by default)
// ID is a shared sequence among all operations in TzKT so it's safe to use it for sorting & pagination
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

  // TODO: use `select` to cut the amount of data we receive where possible
  const operations = await Promise.all([
    getTransactions(addresses, network, tzktRequestOptions),
    getDelegations(addresses, network, tzktRequestOptions),
    getOriginations(addresses, network, tzktRequestOptions),
    getTokenTransfers(addresses, network, tzktRequestOptions),
    getStakingOperations(addresses, network, tzktRequestOptions),
  ]);

  return sortBy(operations.flat(), operation =>
    sort === "asc" ? operation.id : -operation.id
  ).slice(0, limit) as TzktCombinedOperation[];
};

// This function is used to make sure that if a transaction that we made
// caused a token transfer then we definitely represent it as a token transfer
export const getRelatedTokenTransfers = async (transactionIds: number[], network: Network) => {
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
  ) as Promise<RawTzktTokenTransfer[]>;
};

// Some of token transfers are not associated with user's transactions directly.
// For example, account A calls a function to transfer tokens from account B to account C.
// account B holder won't see it in the transactions list, but token transfers will have this record
export const getTokenTransfers = async (
  addresses: RawPkh[],
  network: Network,
  options: {
    offset?: OffsetParameter;
    sort: SortParameter;
    limit: number;
  }
): Promise<TokenTransferOperation[]> =>
  withRateLimit(async () => {
    const tokenTransfers = await tokensGetTokenTransfers(
      {
        anyof: {
          fields: ["from", "to"],
          in: [addresses.join(",")],
        },
        ...options,
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    );
    // other operations have the type field, but token transfers don't
    return (tokenTransfers as RawTzktTokenTransfer[]).map(transfer => ({
      ...transfer,
      type: "token_transfer",
    }));
  });

export const getTezosPriceInUSD = () =>
  withRateLimit(() => tzktApi.quotesGetLast().then(quote => quote.usd));

export const getLatestBlock = async (network: Network): Promise<RawTzktBlock> =>
  withRateLimit(async () => {
    const [block] = await blocksGet(
      {
        limit: 1,
        sort: { desc: "id" },
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    );
    return { level: block.level!, cycle: block.cycle! };
  });

export const getBakers = async (
  network: Network
): Promise<{ name: string; address: RawPkh; stakingBalance: number }[]> =>
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
    ).then(delegates =>
      delegates.map((delegate: Delegate) => ({
        name: delegate.alias || "Unknown baker",
        address: delegate.address!,
        stakingBalance: delegate.stakingBalance!,
      }))
    )
  );

export const getPendingUnstakeRequests = async (
  network: Network,
  addresses: RawPkh[]
): Promise<RawTzktUnstakeRequest[]> =>
  withRateLimit(async () => {
    const requests = await fetch(
      `${network.tzktApiUrl}/v1/staking/unstake_requests?${new URLSearchParams({
        limit: "10000",
        "staker.in": addresses.join(","),
        type: "unstake",
        "status.ne": "finalized",
        "select.fields": "cycle,actualAmount,staker,status",
      })}`
    ).then(res => res.json());

    return requests.map((request: any) => ({
      cycle: request.cycle,
      amount: request.actualAmount,
      staker: request.staker,
      status: request.status,
    }));
  });

export const getOperationsByHash = (hash: string, network: Network) =>
  withRateLimit(() => operationsGetByHash(hash, {}, { baseUrl: network.tzktApiUrl }));
