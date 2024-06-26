import { useQuery } from "@tanstack/react-query";
import { assetsActions, useAppDispatch } from "@umami/state";
import { getAccounts } from "@umami/tzkt";
import { useEffect } from "react";

import { BLOCK_TIME } from "./constants";
import { useRefetchTrigger } from "../hooks/assetsHooks";
import { useAllAccounts } from "../hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

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
