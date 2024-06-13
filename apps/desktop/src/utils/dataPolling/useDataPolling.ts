import { fromUnixTime } from "date-fns";
import { max } from "lodash";
import { useEffect } from "react";

import { usePollAccountStates } from "./usePollAccountStates";
import { usePollBakers } from "./usePollBakers";
import { usePollBlock } from "./usePollBlock";
import { usePollConversionRate } from "./usePollConversionRate";
import { usePollMultisigs } from "./usePollMultisigs";
import { usePollPendingOperations } from "./usePollPendingOperations";
import { usePollProtocolSettings } from "./usePollProtocolSettings";
import { usePollTokenBalances } from "./usePollTokenBalances";
import { usePollUnstakeRequests } from "./usePollUnstakeRequests";
import { useAppDispatch } from "../redux/hooks";
import { assetsActions } from "../redux/slices/assetsSlice";

export const useDataPolling = () => {
  const dispatch = useAppDispatch();

  const pollers = [
    usePollAccountStates(),
    usePollBakers(),
    usePollBlock(),
    usePollConversionRate(),
    usePollMultisigs(),
    usePollPendingOperations(),
    usePollProtocolSettings(),
    usePollTokenBalances(),
    usePollUnstakeRequests(),
  ];

  const isFetching = pollers.some(poller => poller.isFetching);
  const lastUpdatedAt = max(pollers.map(poller => poller.dataUpdatedAt));

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
