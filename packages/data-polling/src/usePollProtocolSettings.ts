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
      // Rio (022) split max_slashing_period into denunciation_period + slashing_delay
      // and exposes the derived unstake_finalization_delay constant directly.
      // ConstantsResponse types all of these as required (it intersects every protocol's
      // constants), but at runtime each network only returns its own protocol's fields.
      const constants: {
        consensus_rights_delay: number;
        max_slashing_period?: number;
        denunciation_period?: number;
        slashing_delay?: number;
        unstake_finalization_delay?: number;
      } = settings;
      const consensusRightsDelay = constants.consensus_rights_delay;
      const maxSlashingPeriod =
        constants.max_slashing_period ??
        (constants.denunciation_period ?? 1) + (constants.slashing_delay ?? 1);
      const unstakeFinalizationDelay =
        constants.unstake_finalization_delay ?? maxSlashingPeriod + consensusRightsDelay;

      dispatch(
        protocolSettingsActions.update({
          network,
          settings: {
            unstakeFinalizationDelay,
            consensusRightsDelay,
          },
        })
      );
    }
  }, [settings, dispatch, network]);

  handleError(query.error);

  return query;
};
