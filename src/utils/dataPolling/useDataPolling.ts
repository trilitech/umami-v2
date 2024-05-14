import { fromUnixTime } from "date-fns";
import { useEffect } from "react";

import { usePollBakers } from "./usePollBakers";
import { usePollBlockLevel } from "./usePollBlockLevel";
import { usePollConversionRate } from "./usePollConversionRate";
import { usePollMultisigs } from "./usePollMultisigs";
import { usePollPendingOperations } from "./usePollPendingOperations";
import { usePollTezBalances } from "./usePollTezBalances";
import { usePollTokenBalances } from "./usePollTokenBalances";
import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";

export const useDataPolling = () => {
  const dispatch = useAppDispatch();

  const { dataUpdatedAt: isMultisigsUpdatedAt, isFetching: isMultisigsFetching } =
    usePollMultisigs();
  const { dataUpdatedAt: isPendingOperationsUpdatedAt, isFetching: isPendingOperationsFetching } =
    usePollPendingOperations();
  const { dataUpdatedAt: isTezBalancesUpdatedAt, isFetching: isTezBalancesFetching } =
    usePollTezBalances();
  const { dataUpdatedAt: isTokenBalancesUpdatedAt, isFetching: isTokenBalancesFetching } =
    usePollTokenBalances();

  usePollConversionRate();
  usePollBlockLevel();
  usePollBakers();

  const isFetching =
    isMultisigsFetching ||
    isPendingOperationsFetching ||
    isTezBalancesFetching ||
    isTokenBalancesFetching;

  const lastUpdatedAt = Math.max(
    isMultisigsUpdatedAt,
    isPendingOperationsUpdatedAt,
    isTezBalancesUpdatedAt,
    isTokenBalancesUpdatedAt
  );

  useEffect(() => {
    dispatch(assetsActions.setIsLoading(isFetching));

    if (!isFetching && lastUpdatedAt) {
      dispatch(
        assetsActions.setLastTimeUpdated(
          fromUnixTime(Math.round(lastUpdatedAt / 1000)).toUTCString()
        )
      );
    }
  }, [dispatch, isFetching, lastUpdatedAt]);
};
