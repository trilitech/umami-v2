import { BigNumber } from "bignumber.js";
import { compact, fromPairs } from "lodash";
import {
  TokenBalanceWithToken,
  keepFA1s,
  keepFA2s,
  keepNFTs,
  NFTBalance,
} from "../../types/TokenBalance";
import { mutezToTez } from "../format";
import { useAppSelector } from "../redux/hooks";
import { getTotalTezBalance } from "./accountUtils";
import { useGetToken } from "./tokensHooks";
import { RawPkh } from "../../types/Address";
import { Delegate } from "../../types/Delegate";

export const useBlockLevel = () => useAppSelector(s => s.assets.blockLevel);

// Tenderbake guarantees block finality after 2 confirmations
export const useIsBlockFinalised = (level: number) => {
  const currentLevel = useBlockLevel();

  return currentLevel !== null ? currentLevel - level >= 2 : null;
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

export const useGetTokenTransfer = () => {
  const tokenTransfers = useAppSelector(s => s.assets.transfers.tokens);
  return (transactionId: number) => tokenTransfers[transactionId];
};

export const useConversionRate = () => useAppSelector(s => s.assets.conversionRate);

export const useTezToDollar = () => {
  const rate = useConversionRate();

  // tezosBalance is in tez
  return (tezosBalance: string) => {
    return rate === null
      ? null
      : new BigNumber(tezosBalance).multipliedBy(rate).decimalPlaces(2, BigNumber.ROUND_UP);
  };
};

export const useGetDollarBalance = () => {
  const tezToDollar = useTezToDollar();

  const getAccountBalance = useGetAccountBalance();

  return (pkh: string) => {
    const mutezBalance = getAccountBalance(pkh);

    if (mutezBalance == null) {
      return null;
    }

    const tezBalance = mutezToTez(mutezBalance);
    return tezToDollar(tezBalance);
  };
};

// Returns the total balance in both tez and dollar
export const useTotalBalance = () => {
  const balances = useAppSelector(s => s.assets.balances.mutez);
  const tezToDollar = useTezToDollar();
  const totalBalance = getTotalTezBalance(balances);

  if (totalBalance == null) {
    return null;
  }

  const usdBalance = tezToDollar(mutezToTez(totalBalance));

  return { mutez: totalBalance.toFixed(), usd: usdBalance };
};

export const useGetAccountBalance = () => {
  const mutezBalances = useAppSelector(s => s.assets.balances.mutez);
  return (pkh: string) => mutezBalances[pkh];
};

export const useBakerList = (): Delegate[] => {
  return useAppSelector(state => state.assets.bakers);
};

export const useGetBaker = () => {
  const bakers = useBakerList();
  return (rawPkh: string) => {
    return bakers.find(baker => baker.address === rawPkh);
  };
};

export const useRefetchTrigger = () => {
  return useAppSelector(state => state.assets.refetchTrigger);
};

export const useIsLoading = () => {
  return useAppSelector(state => state.assets.isLoading);
};

export const useLastTimeUpdated = () => {
  return useAppSelector(state => state.assets.lastTimeUpdated);
};

export const useGetLatestOperations = () => {
  return useAppSelector(state => state.assets.latestOperations);
};
