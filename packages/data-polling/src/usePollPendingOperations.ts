import { useQuery } from "@tanstack/react-query";
import { getPendingOperations } from "@umami/multisig";
import {
  multisigsActions,
  useAppDispatch,
  useMultisigAccounts,
  useSelectedNetwork,
} from "@umami/state";
import { BLOCK_TIME } from "@umami/tezos";
import { useEffect } from "react";

import { useReactQueryErrorHandler } from "./useReactQueryErrorHandler";
import { useRefetchTrigger } from "./useRefetchTrigger";

export const usePollPendingOperations = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();
  const refetchTrigger = useRefetchTrigger();
  const multisigs = useMultisigAccounts();

  const query = useQuery({
    queryKey: ["pendingOperations", network, multisigs, refetchTrigger],
    queryFn: () => getPendingOperations(multisigs, network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    select: operations => operations.flat(),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const pendingOperations = query.data;

  useEffect(() => {
    pendingOperations && dispatch(multisigsActions.setPendingOperations(pendingOperations));
  }, [dispatch, pendingOperations]);

  handleError(query.error);

  return query;
};
