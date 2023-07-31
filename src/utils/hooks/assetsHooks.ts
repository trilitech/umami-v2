import { BigNumber } from "bignumber.js";
import { compact, fromPairs } from "lodash";
import {
  TokenBalanceWithToken,
  keepFA1s,
  keepFA2s,
  keepNFTs,
  NFTBalance,
} from "../../types/TokenBalance";
import { OperationDisplay } from "../../types/Transfer";
import {
  getOperationDisplays,
  sortOperationsByTimestamp,
} from "../../views/operations/operationsUtils";
import { mutezToTez } from "../format";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useAllAccounts } from "./accountHooks";
import { getTotalTezBalance } from "./accountUtils";
import { useGetToken } from "./tokensHooks";
import { RawPkh } from "../../types/Address";
import { Baker } from "../../types/Baker";
import assetsSlice from "../redux/slices/assetsSlice";
import { Account } from "../../types/Account";

export const useSelectedNetwork = () => {
  return useAppSelector(s => s.assets.network);
};

export const useBlockLevel = () => useAppSelector(s => s.assets.blockLevel);

// Tenderbake guarantees block finality after 2 confirmations
export const useIsBlockFinalised = () => {
  const currentLevel = useBlockLevel();

  return (level: number) => (currentLevel !== null ? currentLevel - level >= 2 : null);
};

export const useAllNfts = (): Record<RawPkh, NFTBalance[] | undefined> => {
  const getAccountNFTs = useGetAccountNFTs();
  const accountAddresses = useAppSelector(s => Object.keys(s.assets.balances.tokens));
  return fromPairs(accountAddresses.map(address => [address, getAccountNFTs(address)]));
};

export const useGetAccountAssets = () => {
  const getToken = useGetToken();
  const ownerToTokenBalances = useAppSelector(s => s.assets.balances.tokens);

  return (pkh: string): TokenBalanceWithToken[] => {
    const balances = ownerToTokenBalances[pkh] || [];
    return compact(
      balances.map(({ contract, tokenId, balance }) => {
        const token = getToken(contract, tokenId);
        return token && { ...token, balance };
      })
    );
  };
};

export const useGetAccountFA2Tokens = () => {
  const getAssets = useGetAccountAssets();

  return (pkh: string) => keepFA2s(getAssets(pkh));
};

export const useGetAccountFA1Tokens = () => {
  const getAssets = useGetAccountAssets();

  return (pkh: string) => keepFA1s(getAssets(pkh));
};

export const useGetAccountAllTokens = () => {
  const getFA1 = useGetAccountFA1Tokens();
  const getFA2 = useGetAccountFA2Tokens();

  return (pkh: string) => [...getFA1(pkh), ...getFA2(pkh)];
};

export const useGetAccountNFTs = () => {
  const getAssets = useGetAccountAssets();

  return (pkh: string) => keepNFTs(getAssets(pkh));
};

export const useAllTransfers = () => useAppSelector(s => s.assets.transfers);

export const useGetAccountOperationDisplays = () => {
  const { tez, tokens } = useAllTransfers();
  const delegations = useAllDelegations();

  const network = useSelectedNetwork();

  return (pkh: string) =>
    getOperationDisplays(tez[pkh], tokens[pkh], delegations[pkh], pkh, network);
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

  const dollarBalance = tezToDollar !== null ? tezToDollar(tezBalance) : null;

  return { tezBalance, dollarBalance };
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
  return useAppSelector(s => s.assets.delegations);
};

export const useAllBatches = () => useAppSelector(s => s.assets.batches);

export const useClearBatch = () => {
  const dispatch = useAppDispatch();
  return (account: Account) =>
    dispatch(assetsSlice.actions.clearBatch({ pkh: account.address.pkh }));
};

export const useBakerList = (): Baker[] => {
  return useAppSelector(state => state.assets.bakers);
};

export const useGetBaker = () => {
  const bakers = useBakerList();
  return (rawPkh: string) => {
    return bakers.find(baker => baker.address === rawPkh);
  };
};
