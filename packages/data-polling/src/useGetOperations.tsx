/* istanbul ignore file */
import { useInfiniteQuery } from "@tanstack/react-query";
import { type Account } from "@umami/core";
import {
  type AppDispatch,
  assetsActions,
  tokensActions,
  useAppDispatch,
  useSelectedNetwork,
} from "@umami/state";
import { BLOCK_TIME, type Network } from "@umami/tezos";
import {
  type TokenTransferOperation,
  type TzktCombinedOperation,
  getCombinedOperations,
  getRelatedTokenTransfers,
} from "@umami/tzkt";
import { maxBy } from "lodash";
import { useEffect } from "react";
import { useRefetchTrigger } from "./useRefetchTrigger";
import { useReactQueryErrorHandler } from "./useReactQueryErrorHandler";

type QueryParams =
  | {
      lastId?: number;
      limit?: number;
      sort?: "asc" | "desc";
    }
  | undefined;

/**
 * Hook to fetch operations for given addresses.
 *
 * It fetches the latest operations on the first load and allows
 * to load more (older) operations as needed.
 *
 * Every {@link BLOCK_TIME} it fetches the latest operations
 * and prepends it to the already fetched operations list.
 *
 * If the refresh button is clicked then it will trigger this behaviour immediately.
 *
 * @param accounts - list of accounts to fetch operations related to
 * @returns
 *   operations - operations ordered by id in descending order
 *   isFirstLoad - true if the first load is in progress
 *   isLoading - true if the next page is being fetched
 *   hasMore - true if there are more operations to fetch
 *   loadMore - function to load more operations (older ones)
 */
export const useGetOperations = (accounts: Account[]) => {
  const network = useSelectedNetwork();
  const dispatch = useAppDispatch();
  const refetchTrigger = useRefetchTrigger();
  const handleError = useReactQueryErrorHandler();

  const {
    isFetching,
    data: operations,
    hasNextPage,
    isLoading,
    fetchNextPage,
    fetchPreviousPage,
    error,
  } = useInfiniteQuery({
    queryFn: ({ pageParam }: { pageParam: QueryParams }) =>
      fetchOperationsAndUpdateTokensInfo(dispatch, network, accounts, pageParam),
    queryKey: ["operations", accounts, dispatch, network],
    initialPageParam: {} as QueryParams,
    retry: 3,
    retryDelay: retryCount => retryCount * 2000,
    gcTime: 0,
    refetchOnWindowFocus: false,
    // next page here means the older operations
    // whilst previous page means the newer operations
    // that's done that way because react-query prepends
    // previous pages to the beginning of the pages list
    getNextPageParam: lastPage => {
      if (lastPage.length === 0) {
        return null;
      }

      const lastId = lastPage[lastPage.length - 1].id;
      return { lastId };
    },

    getPreviousPageParam: (_, pages) => {
      const lastId = maxBy(pages.flat(), "id")?.id;

      // if lastId is not defined it means that there are no operations yet for the accounts
      // but we still need to keep updating the operations list to get ones once they appear
      return lastId ? { lastId, sort: "asc" as const } : {};
    },
    select: ({ pages }) =>
      filterDuplicatedTokenTransfers(
        [[...pages[0]].sort((a, b) => (a.id < b.id ? 1 : -1)), ...pages.slice(1)].flat()
      ),
  });

  handleError(error);

  useEffect(() => {
    const interval = setInterval(() => void fetchPreviousPage(), BLOCK_TIME);

    return () => clearInterval(interval);
  }, [fetchPreviousPage]);

  useEffect(() => {
    void fetchPreviousPage();
  }, [refetchTrigger, fetchPreviousPage]);

  return {
    operations: operations || [],
    isFirstLoad: isLoading,
    isLoading: isFetching,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
  };
};

// there are two types of token transfers:
//   - initiated by our accounts. we obtain those through outgoing transactions
//   - initiated by other account. someone sent us a token or token contract owner decided to transfer someone's tokens to another account
//
// to get all of those we need to fetch transactions + their corresponding token transfers (by transaction id)
// and merge it with all token transfers related to our accounts (by destination AND source)
// TODO: Add tests
const fetchOperationsAndUpdateTokensInfo = async (
  dispatch: AppDispatch,
  network: Network,
  accounts: Account[],
  options?: QueryParams
) => {
  const operations = await getCombinedOperations(
    accounts.map(acc => acc.address.pkh),
    network,
    options
  );

  const transactionIds = operations
    .filter(operation => operation.type === "transaction")
    .map(operation => operation.id);

  const tokenTransfersInitiatedByOwnedAccounts = await getRelatedTokenTransfers(
    transactionIds,
    network
  );

  const allTokenTransfersRelatedToOwnedAccounts = operations.filter(
    (operation): operation is TokenTransferOperation => operation.type === "token_transfer"
  );

  const allTokenTransfers = [
    ...tokenTransfersInitiatedByOwnedAccounts,
    ...allTokenTransfersRelatedToOwnedAccounts,
  ];

  dispatch(assetsActions.updateTokenTransfers(allTokenTransfers));
  dispatch(tokensActions.addTokens({ network, tokens: allTokenTransfers.map(t => t.token) }));
  return operations;
};

// when we fetch token transfers related to our accounts we might fetch
// the ones which are initiated by us and hence we get duplicates
export const filterDuplicatedTokenTransfers = (
  operations: TzktCombinedOperation[]
): TzktCombinedOperation[] => {
  const transactionIds = new Set(
    operations.filter(op => op.type !== "token_transfer").map(op => op.id)
  );

  return operations.filter(
    op => op.type !== "token_transfer" || !transactionIds.has(op.transactionId!)
  );
};
