import { useQuery } from "@tanstack/react-query";
import { protocolSettingsActions, useAppDispatch, useSelectedNetwork } from "@umami/state";
import { getProtocolSettings } from "@umami/tezos";
import { hoursToMilliseconds } from "date-fns";
import { useEffect } from "react";

import { useReactQueryErrorHandler } from "./useReactQueryErrorHandler";

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
      dispatch(
        protocolSettingsActions.update({
          network,
          settings: {
            maxSlashingPeriod: settings.max_slashing_period!,
            consensusRightsDelay: settings.consensus_rights_delay,
          },
        })
      );
    }
  }, [settings, dispatch, network]);

  handleError(query.error);

  return query;
};
