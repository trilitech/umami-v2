import { max, min, noop, uniqBy } from "lodash";
import { useEffect, useState } from "react";

import { RawPkh } from "../../types/Address";
import { Network } from "../../types/Network";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
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

// TODO: Add tests
export const useGetOperations = (initialAddresses: RawPkh[]) => {
  const network = useSelectedNetwork();
  const [operations, setOperations] = useState<TzktCombinedOperation[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const [addresses, setAddresses] = useState<RawPkh[]>(initialAddresses);
  const dispatch = useAppDispatch();

  const [updatesTrigger, setUpdatesTrigger] = useState(0);

  const lastId = operations[0]?.id;

  // crutch to be able to use reliably in the dependency array
  const addressesJoined = addresses.toSorted((a, b) => (a > b ? 1 : 0)).join(",");

  useEffect(() => {
    const interval = setInterval(() => {
      handleAsyncAction(async () => {
        const newOperations = await fetchOperationsAndUpdateTokensInfo(
          dispatch,
          network,
          addressesJoined.split(","),
          {
            lastId,
            sort: "asc",
          }
        );

        // reverse is needed because we fetch the operations in the opposite order
        // there is a chance that we get the same operation twice when
        // latest fetching updates so, we need to deduplicate records
        setOperations(currentOperations =>
          uniqBy([...newOperations.reverse(), ...currentOperations], op => op.id)
        );
      }).catch(noop);
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);

    // The only way to correctly start triggering updates is
    // to wait for the first fetch to finish and get the latest operation id
    // to start the updates with
    // but if we add operations to the dependency array, it will trigger the initial fetch
    // once again which will lead to an infinite loop
  }, [updatesTrigger, network, lastId, handleAsyncAction, dispatch, addressesJoined]);

  // initial load
  useEffect(() => {
    setOperations([]);
    setHasMore(true);

    handleAsyncAction(async () => {
      const latestOperations = await fetchOperationsAndUpdateTokensInfo(
        dispatch,
        network,
        addressesJoined.split(",")
      );
      setOperations(latestOperations);
      setHasMore(latestOperations.length > 0);
      setUpdatesTrigger(prev => prev + 1);
    })
      .catch(noop)
      .finally(() => setIsFirstLoad(false));
  }, [network, addressesJoined, dispatch, handleAsyncAction]);

  const loadMore = async () => {
    const lastId = operations[operations.length - 1]?.id;
    if (!lastId) {
      return;
    }

    return handleAsyncAction(async () => {
      const nextChunk = await fetchOperationsAndUpdateTokensInfo(dispatch, network, addresses, {
        lastId,
      });
      setHasMore(nextChunk.length > 0);
      setOperations(currentOperations => [...currentOperations, ...nextChunk]);
    });
  };

  return {
    operations: filterDuplicatedTokenTransfers(operations),
    isFirstLoad,
    isLoading,
    hasMore,
    loadMore,
    setAddresses,
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
  options?: {
    lastId?: number;
    limit?: number;
    sort?: "asc" | "desc";
  }
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
const LOOK_AHEAD = 10; // this should be enough to cover all the cases and not cause O(N^2) lookups
export const filterDuplicatedTokenTransfers = (
  operations: TzktCombinedOperation[]
): TzktCombinedOperation[] => {
  const result: TzktCombinedOperation[] = [];

  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i];
    if (operation.type !== "token_transfer") {
      result.push(operation);
      continue;
    }

    // if token transfer was initiated by a migration or origination then it won't have a duplicate record
    if (operation.transactionId === undefined) {
      result.push(operation);
      continue;
    }

    let hasDuplicate = false;
    for (
      let j = max([i - LOOK_AHEAD, 0]) as number;
      j < (min([i + LOOK_AHEAD, operations.length]) as number);
      j++
    ) {
      if (operations[j].id === operation.transactionId) {
        hasDuplicate = true;
        break;
      }
    }
    if (!hasDuplicate) {
      result.push(operation);
    }
  }

  return result;
};
