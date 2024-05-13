import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { BLOCK_TIME } from "./constants";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";
import { getLatestBlockLevel } from "../tezos";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

export const usePollBlockLevel = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();

  const query = useQuery({
    queryKey: ["blockLevel", dispatch, network],
    queryFn: () => getLatestBlockLevel(network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const blockLevel = query.data;

  useEffect(() => {
    blockLevel && dispatch(assetsActions.updateBlockLevel(blockLevel));
  }, [dispatch, blockLevel]);

  handleError(query.error);

  return query;
};
