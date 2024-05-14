import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { BLOCK_TIME } from "./constants";
import { useRefetchTrigger } from "../hooks/assetsHooks";
import { useMultisigAccounts } from "../hooks/multisigHooks";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { getPendingOperationsForMultisigs } from "../multisig/helpers";
import { useAppDispatch } from "../redux/hooks";
import { multisigActions } from "../redux/slices/multisigsSlice";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

export const usePollPendingOperations = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();
  const refetchTrigger = useRefetchTrigger();
  const multisigs = useMultisigAccounts();

  const query = useQuery({
    queryKey: ["pendingOperations", network, multisigs, refetchTrigger],
    queryFn: () => getPendingOperationsForMultisigs(multisigs, network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    select: operations => operations.flat(),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const pendingOperations = query.data;

  useEffect(() => {
    pendingOperations && dispatch(multisigActions.setPendingOperations(pendingOperations));
  }, [dispatch, pendingOperations]);

  handleError(query.error);

  return query;
};
