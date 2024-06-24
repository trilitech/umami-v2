import { useQuery } from "@tanstack/react-query";
import { getLatestBlock } from "@umami/tzkt";
import { useEffect } from "react";

import { BLOCK_TIME } from "./constants";
import { useRefetchTrigger } from "../hooks/assetsHooks";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

export const usePollBlock = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();
  const refetchTrigger = useRefetchTrigger();

  const query = useQuery({
    queryKey: ["latestBlock", dispatch, network, refetchTrigger],
    queryFn: () => getLatestBlock(network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const block = query.data;

  useEffect(() => {
    block && dispatch(assetsActions.updateBlock(block));
  }, [dispatch, block]);

  handleError(query.error);

  return query;
};
