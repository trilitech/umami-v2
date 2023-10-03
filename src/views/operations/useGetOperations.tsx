import { useEffect, useState } from "react";
import { TzktCombinedOperation, getCombinedOperations } from "../../utils/tezos";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { RawPkh } from "../../types/Address";
import { fetchOperationsAndUpdateTokensInfo } from "../../utils/useAssetsPolling";
import { useAppDispatch } from "../../utils/redux/hooks";
import { uniqBy } from "lodash";

export const useGetOperations = (initialAddresses: RawPkh[]) => {
  const network = useSelectedNetwork();
  const [operations, setOperations] = useState<TzktCombinedOperation[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [addresses, setAddresses] = useState<RawPkh[]>(initialAddresses);
  const dispatch = useAppDispatch();

  const [updatesTrigger, setUpdatesTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const lastId = operations[0]?.id;
      fetchOperationsAndUpdateTokensInfo(dispatch, network, addresses, {
        lastId,
        sort: "asc",
      }).then(newOperations => {
        setOperations(currentOperations =>
          uniqBy([...newOperations.reverse(), ...currentOperations], op => op.id)
        );
      });
    }, 5000);
    return () => clearInterval(interval);

    // The only way to correctly start triggering updates is
    // to wait for the first fetch to finish and get the latest operation id
    // to start the updates with
    // but if we add operations to the dependency array, it will trigger the initial fetch
    // once again which will lead to an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatesTrigger]);

  useEffect(() => {
    setOperations([]); // TODO: Add a loading screen instead
    fetchOperationsAndUpdateTokensInfo(dispatch, network, addresses).then(latestOperations => {
      setOperations(latestOperations);
      setUpdatesTrigger(prev => prev + 1);
    });
  }, [network, addresses, dispatch]);

  const loadMore = async () => {
    const lastId = operations[operations.length - 1].id;
    const nextChunk = await getCombinedOperations(addresses, network, { lastId });
    setHasMore(nextChunk.length > 0);
    setOperations(currentOperations => [...currentOperations, ...nextChunk]);
  };

  return { operations, loadMore, hasMore, setAddresses };
};
