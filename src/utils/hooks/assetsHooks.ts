import { OperationDisplay } from "../../types/Operation";
import { getOperationDisplays } from "../../views/operations/operationsUtils";
import { filterNulls, objectMap } from "../helpers";
import { useAppSelector } from "../store/hooks";
import { makeNft } from "../token/classify/classifyToken";
import { useAccounts } from "./accountHooks";
import { round } from "lodash";
import { useGetAccountBalance, useTotalTezBalance } from "./accountHooks";
import { mutezToTez } from "../store/impureFormat";

export const useSelectedNetwork = () => {
  return useAppSelector((s) => s.assets.network);
};

export const useAllNfts = () => {
  const balances = useAppSelector((s) => s.assets.balances);
  return objectMap(balances, (b) => filterNulls(b.tokens.map(makeNft)));
};

export const useAllOperations = () =>
  useAppSelector((s) => s.assets.operations);

export const useAllOperationDisplays = () => {
  const { tez, tokens } = useAppSelector((s) => s.assets.operations);
  // Use maps because gettings values from objects is unsafe
  // TODO implement maps upstream for reading data elsewhere

  const tezMap = new Map(Object.entries(tez));
  const tokensMap = new Map(Object.entries(tokens));
  const accounts = useAccounts();
  const network = useSelectedNetwork();

  const result: Record<string, OperationDisplay[]> = {};

  accounts.forEach(({ pkh }) => {
    result[pkh] = getOperationDisplays(
      tezMap.get(pkh),
      tokensMap.get(pkh),
      pkh,
      network
    );
  });

  return result;
};
export const useConversionRate = () =>
  useAppSelector((s) => s.assets.conversionRate);

export const useTezToDollar = () => {
  const rate = useConversionRate();
  if (rate === null) {
    return null;
  }
  return (tezosBalance: number) => round(tezosBalance * rate, 2);
};

export const useGetDollarBalance = () => {
  const tezToDollar = useTezToDollar();

  const getAccountBalance = useGetAccountBalance();

  return (pkh: string) => {
    const mutezBalance = getAccountBalance(pkh)?.tez;

    if (
      mutezBalance === null ||
      mutezBalance === undefined ||
      tezToDollar === null
    ) {
      return null;
    }

    const tezBalance = mutezToTez(mutezBalance);
    return tezToDollar(tezBalance);
  };
};

// Returns the total balance in both tez and dollar
export const useTotalBalance = () => {
  const tezToDollar = useTezToDollar();

  const totalMutez = useTotalTezBalance();
  const tezBalance = totalMutez && mutezToTez(totalMutez);

  if (tezBalance === null) {
    return null;
  }

  let dollarBalance = null;
  if (tezToDollar !== null && tezBalance !== null) {
    dollarBalance = tezToDollar(tezBalance);
  }

  return {
    tezBalance,
    dollarBalance,
  };
};
