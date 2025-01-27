import { BigNumber } from "bignumber.js";

import { useGetAccountBalance, useGetAccountState } from "./assets";
import { useGetProtocolSettings } from "./protocolSettings";

export const useGetAccountStakedBalance = (pkh: string) =>
  useGetAccountState()(pkh)?.stakedBalance ?? 0;

export const useGetAccountUnstakeRequests = (pkh: string) =>
  useGetAccountState()(pkh)?.unstakeRequests || [];

export const useGetFirstFinalizableCycle = () => {
  const { maxSlashingPeriod, consensusRightsDelay } = useGetProtocolSettings();

  return (requestedOnCycle: number) => requestedOnCycle + maxSlashingPeriod + consensusRightsDelay;
};

export const useGetAccountBalanceDetails = (pkh: string) => {
  const spendableBalance = BigNumber(useGetAccountBalance()(pkh) ?? 0);
  const stakedBalance = useGetAccountStakedBalance(pkh);
  const totalFinalizableAmount = useAccountTotalFinalizableUnstakeAmount(pkh);
  const totalPendingAmount = useAccountTotalPendingUnstakeAmount(pkh);
  const totalBalance = spendableBalance
    .plus(stakedBalance)
    .plus(totalPendingAmount)
    .plus(totalFinalizableAmount);
  return {
    spendableBalance,
    stakedBalance,
    totalFinalizableAmount,
    totalPendingAmount,
    totalBalance,
  };
};

export const useAccountPendingUnstakeRequests = (pkh: string) =>
  useGetAccountUnstakeRequests(pkh).filter(req => req.status === "pending");

export const useAccountTotalPendingUnstakeAmount = (pkh: string) => {
  const unstakeRequests = useGetAccountUnstakeRequests(pkh);

  return unstakeRequests
    .filter(req => req.status === "pending")
    .reduce((acc, req) => acc.plus(req.amount), BigNumber(0));
};

export const useAccountTotalFinalizableUnstakeAmount = (pkh: string) => {
  const unstakeRequests = useGetAccountUnstakeRequests(pkh);

  return unstakeRequests
    .filter(req => req.status === "finalizable")
    .reduce((acc, req) => acc.plus(req.amount), BigNumber(0));
};
