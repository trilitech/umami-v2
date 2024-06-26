import { useQuery } from "@tanstack/react-query";
import { assetsActions, useAppDispatch } from "@umami/state";
import { getPendingUnstakeRequests } from "@umami/tzkt";
import { useEffect } from "react";

import { BLOCK_TIME } from "./constants";
import { useRefetchTrigger } from "../hooks/assetsHooks";
import { useAllAccounts } from "../hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

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
