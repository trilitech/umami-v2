// TODO: test this file
import BigNumber from "bignumber.js";

import { useGetAccountState } from "./assetsHooks";
import { useGetProtocolSettings } from "./protocolSettingsHooks";

export const useGetAccountStakedBalance = (pkh: string) =>
  useGetAccountState()(pkh)?.stakedBalance ?? 0;

export const useGetAccountUnstakeRequests = (pkh: string) =>
  useGetAccountState()(pkh)?.unstakeRequests || [];

export const useGetFirstFinalizableCycle = () => {
  const { maxSlashingPeriod, consensusRightsDelay } = useGetProtocolSettings();

  return (requestedOnCycle: number) => requestedOnCycle + maxSlashingPeriod + consensusRightsDelay;
};

export const useAccountPendingUnstakeRequests = (pkh: string) =>
  useGetAccountUnstakeRequests(pkh).filter(req => req.status === "pending");

export const useAccountTotalFinalizableUnstakeAmount = (pkh: string) => {
  const unstakeRequests = useGetAccountUnstakeRequests(pkh);

  return unstakeRequests
    .filter(req => req.status === "finalizable")
    .reduce((acc, req) => acc.plus(req.amount), BigNumber(0));
};
