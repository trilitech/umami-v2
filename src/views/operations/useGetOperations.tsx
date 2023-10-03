import { useEffect, useState } from "react";
import { TzktCombinedOperation, getCombinedOperations } from "../../utils/tezos";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { RawPkh } from "../../types/Address";
import { fetchOperationsAndUpdateTokensInfo } from "../../utils/useAssetsPolling";
import { useAppDispatch } from "../../utils/redux/hooks";

// TODO: use reverse cursor for latest updates
export const useGetOperations = (initialAddresses: RawPkh[]) => {
  const network = useSelectedNetwork();
  const accounts = useAllAccounts();
  const [operations, setOperations] = useState<TzktCombinedOperation[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [addresses, setAddresses] = useState<RawPkh[]>(initialAddresses);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setOperations([]); // TODO: Add a loading screen instead

    fetchOperationsAndUpdateTokensInfo(dispatch, network, addresses).then(operations => {
      setOperations(operations);
    });
  }, [network, addresses, dispatch]);

  const loadMore = async () => {
    const lastId = operations[operations.length - 1].id;
    const nextChunk = await getCombinedOperations(
      accounts.map(acc => acc.address.pkh),
      network,
      { lastId }
    );
    setHasMore(nextChunk.length > 0);
    setOperations(currentOperations => [...currentOperations, ...nextChunk]);
  };

  return { operations, loadMore, hasMore, setAddresses };
};
