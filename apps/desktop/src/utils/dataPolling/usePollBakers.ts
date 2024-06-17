import { useQuery } from "@tanstack/react-query";
import { hoursToMilliseconds } from "date-fns";
import { useEffect } from "react";

import { useSelectedNetwork } from "../hooks/networkHooks";
import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";
import { getBakers } from "../tezos";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

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
