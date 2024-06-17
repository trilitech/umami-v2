import { useQuery } from "@tanstack/react-query";
import { hoursToMilliseconds } from "date-fns";
import { useEffect } from "react";

import { useSelectedNetwork } from "../hooks/networkHooks";
import { useAppDispatch } from "../redux/hooks";
import { protocolSettingsActions } from "../redux/slices/protocolSettingsSlice";
import { getProtocolSettings } from "../tezos";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

export const usePollProtocolSettings = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();

  const query = useQuery({
    queryKey: ["protocolSettings", network],
    queryFn: () => getProtocolSettings(network),
    refetchInterval: hoursToMilliseconds(24),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const settings = query.data;

  useEffect(() => {
    if (settings) {
      dispatch(protocolSettingsActions.update({ network, settings }));
    }
  }, [settings, dispatch, network]);

  handleError(query.error);

  return query;
};
