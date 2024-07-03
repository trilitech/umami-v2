import { useQuery } from "@tanstack/react-query";
import { assetsActions, useAllAccounts, useAppDispatch, useSelectedNetwork } from "@umami/state";
import { BLOCK_TIME } from "@umami/tezos";
import { getAccounts } from "@umami/tzkt";
import { useEffect } from "react";

import { useReactQueryErrorHandler } from "./useReactQueryErrorHandler";
import { useRefetchTrigger } from "./useRefetchTrigger";

export const usePollAccountStates = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();
  const refetchTrigger = useRefetchTrigger();
  const addresses = useAllAccounts().map(account => account.address.pkh);

  const query = useQuery({
    queryKey: ["accountStates", network, addresses, refetchTrigger],
    queryFn: () => getAccounts(addresses, network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    select: accountStates => accountStates.flat(),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const accountStates = query.data;

  useEffect(() => {
    accountStates && dispatch(assetsActions.updateAccountStates(accountStates));
  }, [dispatch, accountStates]);

  handleError(query.error);

  return query;
};
