import { useQuery } from "@tanstack/react-query";
import { assetsActions, useAppDispatch, useSelectedNetwork } from "@umami/state";
import { getBakers } from "@umami/tzkt";
import { hoursToMilliseconds } from "date-fns";
import { useEffect } from "react";

import { useReactQueryErrorHandler } from "./useReactQueryErrorHandler";

const BAKERS_REFRESH_RATE = hoursToMilliseconds(2);

export const usePollBakers = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();
  const network = useSelectedNetwork();

  const query = useQuery({
    queryKey: ["bakers", dispatch, network],
    queryFn: () => getBakers(network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BAKERS_REFRESH_RATE,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const bakers = query.data;

  useEffect(() => {
    bakers && dispatch(assetsActions.updateBakers(bakers));
  }, [dispatch, bakers]);

  handleError(query.error);

  return query;
};
