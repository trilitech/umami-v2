import { useQuery } from "@tanstack/react-query";
import { minutesToMilliseconds } from "date-fns";
import { useEffect } from "react";

import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";
import { getTezosPriceInUSD } from "../tezos";
import { useReactQueryErrorHandler } from "../useReactQueryOnError";

const CONVERSION_RATE_REFRESH_RATE = minutesToMilliseconds(5);

export const usePollConversionRate = () => {
  const dispatch = useAppDispatch();
  const handleError = useReactQueryErrorHandler();

  const query = useQuery({
    queryKey: ["conversionRate", dispatch],
    queryFn: getTezosPriceInUSD,
    refetchInterval: CONVERSION_RATE_REFRESH_RATE,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const rate = query.data;

  useEffect(() => {
    dispatch(assetsActions.updateConversionRate(rate));
  }, [dispatch, rate]);

  handleError(query.error);

  return query;
};
