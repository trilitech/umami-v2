import { formatRelative } from "date-fns";
import { Delegation } from "../../types/Delegation";
import { prettyTezAmount } from "../format";
import { useGetAccountBalance } from "./assetsHooks";

export const useGetDelegationPrettyDisplayValues = () => {
  const getAccountBalance = useGetAccountBalance();

  return (d: Delegation) => {
    const balance = getAccountBalance(d.sender);
    const now = new Date();
    const initialBalance = prettyTezAmount(d.amount);
    const currentBalance = balance && prettyTezAmount(balance);
    const duration = `Since ${formatRelative(new Date(d.timestamp), now)}`;
    return {
      initialBalance,
      currentBalance,
      duration,
    };
  };
};
