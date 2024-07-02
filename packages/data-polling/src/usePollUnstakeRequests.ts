import { useQuery } from "@tanstack/react-query";
import { assetsActions, useAllAccounts, useAppDispatch, useSelectedNetwork } from "@umami/state";
import { BLOCK_TIME } from "@umami/tezos";
import { getPendingUnstakeRequests } from "@umami/tzkt";
import { useEffect } from "react";

import { useReactQueryErrorHandler } from "./useReactQueryErrorHandler";
import { useRefetchTrigger } from "./useRefetchTrigger";

export const usePollUnstakeRequests = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();
  const refetchTrigger = useRefetchTrigger();
  const addresses = useAllAccounts().map(account => account.address.pkh);

  const query = useQuery({
    queryKey: ["unstakeRequests", dispatch, network, addresses, refetchTrigger],
    queryFn: () => getPendingUnstakeRequests(network, addresses),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const unstakeRequests = query.data;

  useEffect(() => {
    unstakeRequests && dispatch(assetsActions.updateUnstakeRequests(unstakeRequests));
  }, [dispatch, unstakeRequests]);

  handleError(query.error);

  return query;
};
