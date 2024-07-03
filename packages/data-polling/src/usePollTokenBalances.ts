import { useQuery } from "@tanstack/react-query";
import {
  assetsActions,
  tokensActions,
  useAllAccounts,
  useAppDispatch,
  useSelectedNetwork,
} from "@umami/state";
import { BLOCK_TIME } from "@umami/tezos";
import { getTokenBalances } from "@umami/tzkt";
import { useEffect } from "react";

import { useReactQueryErrorHandler } from "./useReactQueryErrorHandler";
import { useRefetchTrigger } from "./useRefetchTrigger";

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
