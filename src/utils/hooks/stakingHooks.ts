// TODO: test this file
import { useGetAccountState, useGetCurrentCycle } from "./assetsHooks";
import { useGetProtocolSettings } from "./protocolSettingsHooks";
import { sumTez } from "../tezos";
import { RawTzktUnstakeRequest } from "../tzkt/types";

export const useGetAccountStakedBalance = (pkh: string) =>
  useGetAccountState()(pkh)?.stakedBalance || 0;

export const useGetAccountUnstakeRequests = (pkh: string) =>
  useGetAccountState()(pkh)?.unstakeRequests || [];

export const useGetFirstFinalizableCycle = () => {
  const { maxSlashingPeriod, consensusRightsDelay } = useGetProtocolSettings();

  return (requestedOnCycle: number) => requestedOnCycle + maxSlashingPeriod + consensusRightsDelay;
};

export const useGetIsUnstakeFinalizable = () => {
  const currentCycle = useGetCurrentCycle();
  const getFirstFinalizableCycle = useGetFirstFinalizableCycle();

  return (request: RawTzktUnstakeRequest) =>
    !!currentCycle && getFirstFinalizableCycle(request.cycle) <= currentCycle;
};

export const useAccountPendingUnstakeRequests = (pkh: string) => {
  const unstakeRequests = useGetAccountUnstakeRequests(pkh);
  const isUnstakeFinalizable = useGetIsUnstakeFinalizable();

  return unstakeRequests.filter(request => !isUnstakeFinalizable(request));
};

export const useAccountTotalFinalizableUnstakeAmount = (pkh: string) => {
  const unstakeRequests = useGetAccountUnstakeRequests(pkh);
  const isUnstakeFinalizable = useGetIsUnstakeFinalizable();

  return sumTez(unstakeRequests.filter(isUnstakeFinalizable).map(req => req.finalizableAmount));
};
