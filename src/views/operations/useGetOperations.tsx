import { useInfiniteQuery } from "@tanstack/react-query";
import { maxBy } from "lodash";
import { useEffect } from "react";

import { RawPkh } from "../../types/Address";
import { Network } from "../../types/Network";
import { useRefetchTrigger } from "../../utils/hooks/assetsHooks";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import { tokensActions } from "../../utils/redux/slices/tokensSlice";
import { AppDispatch } from "../../utils/redux/store";
import {
  TokenTransferOperation,
  TzktCombinedOperation,
  getCombinedOperations,
  getRelatedTokenTransfers,
} from "../../utils/tezos";

const REFRESH_INTERVAL = 15000;

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
 * Every {@link REFRESH_INTERVAL} it fetches the latest operations
 * and prepends it to the already fetched operations list.
 *
 * If the refresh button is clicked then it will trigger this behaviour immediately.
 *
 * @param addresses - list of addresses to fetch operations related to
 * @returns
 *   operations - operations ordered by id in descending order
 *   isFirstLoad - true if the first load is in progress
 *   isLoading - true if the next page is being fetched
 *   hasMore - true if there are more operations to fetch
 *   loadMore - function to load more operations (older ones)
 */
export const useGetOperations = (addresses: RawPkh[]) => {
  const network = useSelectedNetwork();
  const dispatch = useAppDispatch();
  const refetchTrigger = useRefetchTrigger();

  const {
    isFetching,
    data: operations,
    hasNextPage,
    isLoading,
    fetchNextPage,
    fetchPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["operations", addresses, dispatch, network],
    initialPageParam: undefined as QueryParams,
    queryFn: async ({ pageParam }) =>
      fetchOperationsAndUpdateTokensInfo(dispatch, network, addresses, pageParam),
    getNextPageParam: lastPage => {
      if (lastPage.length === 0) {
        return undefined;
      }

      const lastId = lastPage[lastPage.length - 1].id;
      return { lastId };
    },

    getPreviousPageParam: (_, pages) => {
      const lastId = maxBy(pages.flat(), "id")?.id;

      // if lastId is not defined it means that there are no operations yet for the accounts
      // but we still need to keep updating the operations list to get ones once they appear
      return lastId ? { lastId, sort: "asc" as const } : undefined;
    },

    select: ({ pages }) => {
      const firstPage = pages[0];
      // no need to shuffle the array if there are no operations
      // it happens when there are no new operations since last fetch
      // it will add an empty page to the list of pages
      if (firstPage.length === 0) {
        return pages.flat();
      }

      // new operations are always sorted ascending by id
      // but they are displayed in descending order
      firstPage.sort((a, b) => b.id - a.id);

      return filterDuplicatedTokenTransfers([...firstPage, ...pages.slice(1).flat()]);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      void fetchPreviousPage();
    }, REFRESH_INTERVAL);

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
  addresses: RawPkh[],
  options?: QueryParams
) => {
  const operations = await getCombinedOperations(addresses, network, options);

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
