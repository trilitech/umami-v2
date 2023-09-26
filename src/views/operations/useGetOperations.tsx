import { useEffect, useState } from "react";
import { TzktCombinedOperation, getCombinedOperations } from "../../utils/tezos";
import { useGetLatestOperations } from "../../utils/hooks/assetsHooks";
import { uniqBy } from "lodash";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAllAccounts } from "../../utils/hooks/accountHooks";

export const operationKey = (operation: TzktCombinedOperation): string =>
  `${operation.type}-${operation.id}`;

// TODO: add support for filtering by account
// just offline filtering should be fine
// don't forget about sender/target
// TODO: handle network change
export const useGetOperations = () => {
  const latestOperations = useGetLatestOperations();
  const network = useSelectedNetwork();
  const accounts = useAllAccounts();
  const [operations, setOperations] = useState<TzktCombinedOperation[]>(latestOperations);
  const [hasMore, setHasMore] = useState(true);

  // when new operations are fetched, prepend them to the list
  useEffect(() => {
    // some of the operations may overlap, so we need to dedupe them
    setOperations(currentOperations =>
      uniqBy([...latestOperations, ...currentOperations], operationKey)
    );
  }, [latestOperations]);

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

  return { operations, loadMore, hasMore };
};
