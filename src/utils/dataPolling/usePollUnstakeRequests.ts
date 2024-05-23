import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { BLOCK_TIME } from "./constants";
import { useRefetchTrigger } from "../hooks/assetsHooks";
import { useAllAccounts } from "../hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";
import { getUnstakeRequests } from "../tezos";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

export const usePollUnstakeRequests = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();
  const refetchTrigger = useRefetchTrigger();
  const addresses = useAllAccounts().map(account => account.address.pkh);

  const query = useQuery({
    queryKey: ["unstakeRequests", dispatch, network, addresses, refetchTrigger],
    queryFn: () => getUnstakeRequests(network, addresses),
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
