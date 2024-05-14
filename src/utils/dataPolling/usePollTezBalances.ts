import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { BLOCK_TIME } from "./constants";
import { useRefetchTrigger } from "../hooks/assetsHooks";
import { useAllAccounts } from "../hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";
import { getAccounts } from "../tezos";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

export const usePollTezBalances = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();
  const refetchTrigger = useRefetchTrigger();
  const addresses = useAllAccounts().map(account => account.address.pkh);

  const query = useQuery({
    queryKey: ["accountInformation", network, addresses, refetchTrigger],
    queryFn: () => getAccounts(addresses, network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    select: accountInformation => accountInformation.flat(),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const accountInformation = query.data;

  useEffect(() => {
    accountInformation && dispatch(assetsActions.updateTezBalance(accountInformation));
  }, [dispatch, accountInformation]);

  handleError(query.error);

  return query;
};
