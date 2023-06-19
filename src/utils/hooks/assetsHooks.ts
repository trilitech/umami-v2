import { compact } from "lodash";
import { Asset, fromToken, keepFA1s, keepFA2s, keepNFTs } from "../../types/Asset";
import { OperationDisplay } from "../../types/Operation";
import { getOperationDisplays } from "../../views/operations/operationsUtils";
import { objectMap } from "../helpers";
import assetsSlice from "../store/assetsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useImplicitAccounts } from "./accountHooks";
import { getTotalTezBalance } from "./accountUtils";
import { BigNumber } from "bignumber.js";
import { mutezToTez } from "../format";

export const useSelectedNetwork = () => {
  return useAppSelector(s => s.assets.network);
};

export const useBlockLevel = () => useAppSelector(s => s.assets.blockLevel);

// Tenderbake guarantees block finality after 2 confirmations
export const useIsBlockFinalised = () => {
  const currentLevel = useBlockLevel();

  return (level: number) => (currentLevel !== null ? currentLevel - level >= 2 : null);
};

export const useAllNfts = () => {
  const allTokens = useAppSelector(s => s.assets.balances.tokens);

  return objectMap(allTokens, tokens => {
    const compactedTokens = compact(tokens);
    return keepNFTs(compact(compactedTokens.map(fromToken)).filter(t => t.balance !== "0"));
  });
};

export const useAccountAssets = () => {
  const allTokens = useAppSelector(s => s.assets.balances.tokens);

  return objectMap(allTokens, tokens => {
    const compactedTokens = compact(tokens);
    return compact(compactedTokens.map(fromToken)).filter(t => t.balance !== "0");
  });
};

export const useGetAccountAssets = () => {
  const allTokens = useAppSelector(s => s.assets.balances.tokens);

  return (pkh: string) => {
    return compact((allTokens[pkh] ?? []).map(fromToken));
  };
};

export const useGetAccountAssetsLookup = (): ((pkh: string) => Record<string, Asset[]>) => {
  const getAccountAssets = useGetAccountAssets();

  return (pkh: string): Record<string, Asset[]> =>
    getAccountAssets(pkh).reduce((acc: Record<string, Asset[]>, cur) => {
      if (!acc[cur.contract]) {
        acc[cur.contract] = [];
      }
      acc[cur.contract].push(cur);
      return acc;
    }, {});
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

export const useHasTokens = () => {
  const accounts = useImplicitAccounts();
  const getFA1 = useGetAccountFA1Tokens();
  const getFA2 = useGetAccountFA2Tokens();
  return () =>
    accounts
      .map(account => [...getFA1(account.address.pkh), ...getFA2(account.address.pkh)].length > 0)
      .includes(true);
};

export const useGetAccountNFTs = () => {
  const getAssets = useGetAccountAssets();

  return (pkh: string) => {
    return keepNFTs(getAssets(pkh));
  };
};

export const useAllTransfers = () => useAppSelector(s => s.assets.transfers);

export const useAllOperationDisplays = () => {
  const { tez, tokens } = useAllTransfers();
  const delegations = useAllDelegations();

  const accounts = useImplicitAccounts();
  const network = useSelectedNetwork();

  const result: Record<string, OperationDisplay[]> = {};

  accounts.forEach(({ address }) => {
    result[address.pkh] = getOperationDisplays(
      tez[address.pkh],
      tokens[address.pkh],
      delegations[address.pkh],
      address.pkh,
      network
    );
  });

  return result;
};

export const useConversionRate = () => useAppSelector(s => s.assets.conversionRate);

export const useTezToDollar = () => {
  const rate = useConversionRate();
  if (rate === null) {
    return null;
  }
  return (tezosBalance: string) => new BigNumber(tezosBalance).multipliedBy(rate);
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

  const totalMutez = useTotalMutezBalance();
  const tezBalance = totalMutez && mutezToTez(totalMutez);

  if (tezBalance == null) {
    return null;
  }

  const dollarBalance =
    tezToDollar !== null && tezBalance !== null ? tezToDollar(tezBalance) : null;

  return {
    tezBalance,
    dollarBalance,
  };
};

export const useGetAccountBalance = () => {
  const balances = useAppSelector(s => s.assets.balances.tez);

  const balancesMap = new Map(Object.entries(balances));
  return (pkh: string) => {
    const val = balancesMap.get(pkh);
    return val === undefined ? null : val;
  };
};

export const useTotalMutezBalance = () => {
  const balances = useAppSelector(s => s.assets.balances.tez);

  return getTotalTezBalance(balances);
};

export const useAllDelegations = () => {
  const allDelegations = useAppSelector(s => s.assets.delegations);

  // const result = objectMap(activeDelegations, (d) => {
  //   return { sender: d.sender?.address } as Delegation;
  // });

  return allDelegations;
};

export const useAllBatches = () => useAppSelector(s => s.assets.batches);

export const useBatchIsSimulating = () => {
  const batches = useAllBatches();
  return (pkh: string) => batches[pkh]?.isSimulating || false;
};

export const useClearBatch = () => {
  const dispatch = useAppDispatch();
  return (pkh: string) => dispatch(assetsSlice.actions.clearBatch({ pkh }));
};
