import { BigNumber } from "bignumber.js";
import { compact, fromPairs } from "lodash";
import { MultisigAccount } from "../../types/Account";
import { TokenBalance, keepFA1s, keepFA2s, keepNFTs, NFTBalance } from "../../types/Asset";
import { OperationDisplay } from "../../types/Operation";
import {
  getOperationDisplays,
  sortOperationsByTimestamp,
} from "../../views/operations/operationsUtils";
import { mutezToTez } from "../format";
import { objectMap } from "../helpers";
import assetsSlice from "../store/assetsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useAllAccounts, useImplicitAccounts } from "./accountHooks";
import { getTotalTezBalance } from "./accountUtils";

export const useSelectedNetwork = () => {
  return useAppSelector(s => s.assets.network);
};

export const useBlockLevel = () => useAppSelector(s => s.assets.blockLevel);

// Tenderbake guarantees block finality after 2 confirmations
export const useIsBlockFinalised = () => {
  const currentLevel = useBlockLevel();

  return (level: number) => (currentLevel !== null ? currentLevel - level >= 2 : null);
};

export const useAllNfts = (): Record<string, NFTBalance[] | undefined> => {
  const ownerToTokens = useAppSelector(s => s.assets.balances.tokens);

  return objectMap(ownerToTokens, tokens => keepNFTs(compact(tokens)));
};

export const useGetAccountAssets = () => {
  const ownerToTokens = useAppSelector(s => s.assets.balances.tokens);

  return (pkh: string) => ownerToTokens[pkh] ?? [];
};

export const useGetAccountAssetsLookup = (): ((
  pkh: string
) => Record<string, TokenBalance[] | undefined>) => {
  const getAccountAssets = useGetAccountAssets();

  return (pkh: string): Record<string, TokenBalance[]> =>
    getAccountAssets(pkh).reduce((acc: Record<string, TokenBalance[]>, cur) => {
      if (!acc[cur.contract]) {
        acc[cur.contract] = [];
      }
      acc[cur.contract].push(cur);
      return acc;
    }, {});
};

export const useSearchAsset = () => {
  const ownerToTokens = useAppSelector(s => s.assets.balances.tokens);
  const allAssets = compact(Object.values(ownerToTokens).flat());

  return (contractAddress: string, tokenId: string | undefined) => {
    if (!tokenId) {
      return compact(allAssets).find(asset => asset.contract === contractAddress);
    }

    return compact(allAssets)
      .filter(asset => asset.contract === contractAddress)
      .find(asset => asset.type !== "fa1.2" && asset.tokenId === tokenId);
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

export const useAllTransfers = () => useAppSelector(s => s.assets.transfers);

export const useGetAccountOperationDisplays = () => {
  const { tez, tokens } = useAllTransfers();
  const delegations = useAllDelegations();

  const network = useSelectedNetwork();

  return (pkh: string) => {
    return getOperationDisplays(tez[pkh], tokens[pkh], delegations[pkh], pkh, network);
  };
};

export const useGetOperationDisplays = (): Record<string, OperationDisplay[] | undefined> => {
  const accounts = useAllAccounts();
  const getOperations = useGetAccountOperationDisplays();

  return fromPairs(
    accounts.map(account => [account.address.pkh, getOperations(account.address.pkh)])
  );
};

export const useGetAllOperationDisplays = () => {
  const getOperations = useGetAccountOperationDisplays();
  const accounts = useAllAccounts();
  const allOperations = accounts.map(a => getOperations(a.address.pkh)).flat();

  return sortOperationsByTimestamp(allOperations);
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
  const mutezBalances = useAppSelector(s => s.assets.balances.mutez);

  const balancesMap = new Map(Object.entries(mutezBalances));
  return (pkh: string) => {
    const val = balancesMap.get(pkh);
    return val === undefined ? null : val;
  };
};

export const useTotalMutezBalance = () => {
  const balances = useAppSelector(s => s.assets.balances.mutez);

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

export const useGetMultisigSigners = () => {
  const implicitAccounts = useImplicitAccounts();
  return (multisigAccount: MultisigAccount) => {
    const signers = implicitAccounts.filter(implicitAccount =>
      multisigAccount.signers.some(signer => signer.pkh === implicitAccount.address.pkh)
    );

    if (signers.length === 0) {
      console.warn(
        "Wallet doesn't own any signers for multisig contract " + multisigAccount.address.pkh
      );
    }
    return signers;
  };
};
