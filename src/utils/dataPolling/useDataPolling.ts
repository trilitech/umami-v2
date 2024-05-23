import { fromUnixTime } from "date-fns";
import { useEffect } from "react";

import { usePollAccountStates } from "./usePollAccountStates";
import { usePollBakers } from "./usePollBakers";
import { usePollBlock } from "./usePollBlock";
import { usePollConversionRate } from "./usePollConversionRate";
import { usePollMultisigs } from "./usePollMultisigs";
import { usePollPendingOperations } from "./usePollPendingOperations";
import { usePollTokenBalances } from "./usePollTokenBalances";
import { usePollUnstakeRequests } from "./usePollUnstakeRequests";
import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";

export const useDataPolling = () => {
  const dispatch = useAppDispatch();

  const { dataUpdatedAt: isMultisigsUpdatedAt, isFetching: isMultisigsFetching } =
    usePollMultisigs();
  const { dataUpdatedAt: isPendingOperationsUpdatedAt, isFetching: isPendingOperationsFetching } =
    usePollPendingOperations();
  const { dataUpdatedAt: isAccountStatesUpdatedAt, isFetching: isAccountStatesFetching } =
    usePollAccountStates();
  const { dataUpdatedAt: isUnstakeRequestUpdatedAt, isFetching: isUnstakeRequestFetching } =
    usePollUnstakeRequests();
  const { dataUpdatedAt: isTokenBalancesUpdatedAt, isFetching: isTokenBalancesFetching } =
    usePollTokenBalances();

  usePollConversionRate();
  usePollBlock();
  usePollBakers();

  const isFetching =
    isMultisigsFetching ||
    isPendingOperationsFetching ||
    isAccountStatesFetching ||
    isTokenBalancesFetching ||
    isUnstakeRequestFetching;

  const lastUpdatedAt = Math.max(
    isMultisigsUpdatedAt,
    isPendingOperationsUpdatedAt,
    isAccountStatesUpdatedAt,
    isTokenBalancesUpdatedAt,
    isUnstakeRequestUpdatedAt
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
