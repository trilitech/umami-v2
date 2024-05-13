import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { BLOCK_TIME } from "./constants";
import { useRefetchTrigger } from "../hooks/assetsHooks";
import { useAllAccounts } from "../hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";
import { tokensActions } from "../redux/slices/tokensSlice";
import { getTokenBalances } from "../tezos";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

export const usePollTokenBalances = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();
  const refetchTrigger = useRefetchTrigger();
  const addresses = useAllAccounts().map(account => account.address.pkh);

  const query = useQuery({
    queryKey: ["tokenBalances", network, addresses, refetchTrigger],
    queryFn: () => getTokenBalances(addresses, network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    select: tokenBalances => tokenBalances.flat(),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const tokenBalances = query.data;

  useEffect(() => {
    if (!tokenBalances) {
      return;
    }

    const tokens = tokenBalances.map(({ token, lastLevel }) => ({ ...token, lastLevel }));
    dispatch(tokensActions.addTokens({ network, tokens }));
    dispatch(assetsActions.updateTokenBalance(tokenBalances));
  }, [dispatch, tokenBalances, network]);

  handleError(query.error);

  return query;
};
