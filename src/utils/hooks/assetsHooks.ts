import { OperationDisplay } from "../../types/Operation";
import { getOperationDisplays } from "../../views/operations/operationsUtils";
import { filterNulls, objectMap } from "../helpers";
import { useAppSelector } from "../store/hooks";
import { makeNft } from "../token/classify/classifyToken";
import { useAccounts } from "./accountHooks";

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
