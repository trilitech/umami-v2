import { round } from "lodash";
import { keepFA1s, keepFA2s, keepNFTs } from "../../types/Asset";
import { OperationDisplay } from "../../types/Operation";
import { getOperationDisplays } from "../../views/operations/operationsUtils";
import { filterNulls, objectMap } from "../helpers";
import assetsSlice from "../store/assetsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { mutezToTez } from "../store/impureFormat";
import { classifyToken, makeNft } from "../token/classify/classifyToken";
import { useAccounts } from "./accountHooks";
import { getTotalBalance } from "./accountUtils";

export const useSelectedNetwork = () => {
  return useAppSelector((s) => s.assets.network);
};

export const useBlockLevel = () => useAppSelector((s) => s.assets.blockLevel);

// Tenderbake guarantees block finality after 2 confirmations
export const useIsBlockFinalised = () => {
  const currentLevel = useBlockLevel();

  return (level: number) =>
    currentLevel !== null ? currentLevel - level >= 2 : null;
};

export const useAllNfts = () => {
  const allTokens = useAppSelector((s) => s.assets.balances.tokens);

  return objectMap(allTokens, (tokens) =>
    filterNulls(tokens.map(makeNft)).filter((t) => t.balance !== "0")
  );
};

export const useAccountAssets = () => {
  const allTokens = useAppSelector((s) => s.assets.balances.tokens);

  return objectMap(allTokens, (tokens) =>
    filterNulls(tokens.map(makeNft)).filter((t) => t.balance !== "0")
  );
};

export const useGetAccountAssets = () => {
  const allTokens = useAppSelector((s) => s.assets.balances.tokens);

  return (pkh: string) => {
    return filterNulls(allTokens[pkh].map(classifyToken));
  };
};

export const useGetAccountFA2Tokens = () => {
  const getAssets = useGetAccountAssets();

  return (pkh: string) => {
    return keepFA2s(getAssets(pkh));
  };
};

export const useGetAccountFA1Tokens = () => {
  const getAssets = useGetAccountAssets();

  return (pkh: string) => {
    return keepFA1s(getAssets(pkh));
  };
};

export const useGetAccountAllTokens = () => {
  const getFA1 = useGetAccountFA1Tokens();
  const getFA2 = useGetAccountFA2Tokens();

  return (pkh: string) => {
    return [...getFA1(pkh), ...getFA2(pkh)];
  };
};

export const useGetAccountNFTs = () => {
  const getAssets = useGetAccountAssets();

  return (pkh: string) => {
    return keepNFTs(getAssets(pkh));
  };
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

const useTezToDollar = () => {
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
    const mutezBalance = getAccountBalance(pkh);

    if (mutezBalance == null || tezToDollar === null) {
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

  const dollarBalance =
    tezToDollar !== null && tezBalance !== null
      ? tezToDollar(tezBalance)
      : null;

  return {
    tezBalance,
    dollarBalance,
  };
};

export const useGetAccountBalance = () => {
  const balances = useAppSelector((s) => s.assets.balances.tez);

  const balancesMap = new Map(Object.entries(balances));
  return (pkh: string) => {
    const val = balancesMap.get(pkh);
    return val === undefined ? null : val;
  };
};

export const useTotalTezBalance = () => {
  const balances = useAppSelector((s) => s.assets.balances.tez);

  return getTotalBalance(balances);
};

export const useAllDelegations = () => {
  const allDelegations = useAppSelector((s) => s.assets.delegations);

  // const result = objectMap(activeDelegations, (d) => {
  //   return { sender: d.sender?.address } as Delegation;
  // });

  return allDelegations;
};

export const useAllBatches = () => useAppSelector((s) => s.assets.batches);

export const useBatchIsSimulating = () => {
  const batches = useAllBatches();
  return (pkh: string) => batches[pkh]?.isSimulating || false;
};

export const useClearBatch = () => {
  const dispatch = useAppDispatch();
  return (pkh: string) => dispatch(assetsSlice.actions.clearBatch({ pkh }));
};
