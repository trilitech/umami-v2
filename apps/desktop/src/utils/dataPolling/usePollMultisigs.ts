import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { BLOCK_TIME } from "./constants";
import { useRefetchTrigger } from "../hooks/assetsHooks";
import { useImplicitAccounts } from "../hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../hooks/networkHooks";
import { getRelevantMultisigContracts } from "../multisig/helpers";
import { useAppDispatch } from "../redux/hooks";
import { multisigActions } from "../redux/slices/multisigsSlice";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

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
    multisigs && dispatch(multisigActions.setMultisigs(multisigs));
  }, [multisigs, dispatch]);

  handleError(query.error);

  return query;
};
