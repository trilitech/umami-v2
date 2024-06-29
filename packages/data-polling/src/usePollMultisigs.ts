import { useQuery } from "@tanstack/react-query";
import { getRelevantMultisigContracts } from "@umami/multisig";
import {
  multisigsActions,
  useAppDispatch,
  useImplicitAccounts,
  useSelectedNetwork,
} from "@umami/state";
import { BLOCK_TIME } from "@umami/tezos";
import { useEffect } from "react";

import { useReactQueryErrorHandler } from "./useReactQueryErrorHandler";
import { useRefetchTrigger } from "./useRefetchTrigger";

export const usePollMultisigs = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const refetchTrigger = useRefetchTrigger();
  const network = useSelectedNetwork();
  const addresses = useImplicitAccounts().map(account => account.address.pkh);

  const query = useQuery({
    queryKey: ["multisigs", network, addresses, refetchTrigger],
    queryFn: () => getRelevantMultisigContracts(new Set(addresses), network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const multisigs = query.data;

  useEffect(() => {
    multisigs && dispatch(multisigsActions.setMultisigs(multisigs));
  }, [multisigs, dispatch]);

  handleError(query.error);

  return query;
};
