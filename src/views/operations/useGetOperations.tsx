import { useEffect, useState } from "react";
import {
  TzktCombinedOperation,
  getCombinedOperations,
  getTokenTransfersFor,
} from "../../utils/tezos";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { RawPkh } from "../../types/Address";
import { useAppDispatch } from "../../utils/redux/hooks";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import { tokensActions } from "../../utils/redux/slices/tokensSlice";
import { Network } from "../../types/Network";
import { AppDispatch } from "../../utils/redux/store";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { uniqBy } from "lodash";

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

  useEffect(() => {
    const interval = setInterval(() => {
      handleAsyncAction(async () => {
        const lastId = operations[0]?.id;
        const newOperations = await fetchOperationsAndUpdateTokensInfo(
          dispatch,
          network,
          addresses,
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
      });
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);

    // The only way to correctly start triggering updates is
    // to wait for the first fetch to finish and get the latest operation id
    // to start the updates with
    // but if we add operations to the dependency array, it will trigger the initial fetch
    // once again which will lead to an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatesTrigger]);

  // that's needed to make sure we don't trigger the initial fetch twice
  const addressesJoined = addresses.join(",");

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
    }).finally(() => {
      setIsFirstLoad(false);
    });
    // handleAsyncAction gets constantly recreated, so we can't add it to the dependency array
    // otherwise, it will trigger the initial fetch infinitely
    // caching handleAsyncAction using useCallback doesn't work either
    // because it depends on its own isLoading state which changes sometimes
    // TODO: check useRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, addressesJoined, dispatch]);

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

  return { operations, isFirstLoad, isLoading, hasMore, loadMore, setAddresses };
};

// TODO: Add tests
export const fetchOperationsAndUpdateTokensInfo = async (
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
  const tokenTransfers = await getTokenTransfersFor(
    operations.map(op => op.id),
    network
  );

  dispatch(assetsActions.updateTokenTransfers(tokenTransfers));
  dispatch(tokensActions.addTokens({ network, tokens: tokenTransfers.map(t => t.token) }));
  return operations;
};
