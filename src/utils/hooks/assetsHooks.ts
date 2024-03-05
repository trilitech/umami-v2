import { BigNumber } from "bignumber.js";
import { compact, fromPairs } from "lodash";

import { useGetToken } from "./tokensHooks";
import { RawPkh } from "../../types/Address";
import { Delegate } from "../../types/Delegate";
import {
  NFTBalance,
  TokenBalanceWithToken,
  keepFA1s,
  keepFA2s,
  keepNFTs,
} from "../../types/TokenBalance";
import { mutezToTez } from "../format";
import { useAppSelector } from "../redux/hooks";

const useBlockLevel = () => useAppSelector(s => s.assets.blockLevel);

// Tenderbake guarantees block finality after 2 confirmations
export const useIsBlockFinalised = (level: number) => {
  const currentLevel = useBlockLevel();

  return currentLevel !== null ? currentLevel - level >= 2 : null;
};

export const useAllNfts = (): Record<RawPkh, NFTBalance[] | undefined> => {
  const getAccountNFTs = useGetAccountNFTs();
  const tokenBalancesByAddress = useAppSelector(s => s.assets.balances.tokens);
  const addresses = Object.keys(tokenBalancesByAddress);
  return fromPairs(addresses.map(address => [address, getAccountNFTs(address)]));
};

const useGetAccountAssets = () => {
  const getToken = useGetToken();
  const ownerToTokenBalances = useAppSelector(s => s.assets.balances.tokens);
  return (pkh: string): TokenBalanceWithToken[] => {
    const balances = ownerToTokenBalances[pkh] || [];
    return compact(
      balances.map(({ contract, tokenId, ...rest }) => {
        const token = getToken(contract, tokenId);
        return token && { ...token, ...rest };
      })
    );
  };
};

const useGetAccountFA2Tokens = () => {
  const getAssets = useGetAccountAssets();

  return (pkh: string) => keepFA2s(getAssets(pkh));
};

const useGetAccountFA1Tokens = () => {
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

const useConversionRate = () => useAppSelector(s => s.assets.conversionRate);

const useTezToDollar = () => {
  const rate = useConversionRate();

  // tezosBalance is in tez
  return (tezosBalance: string) =>
    rate === null
      ? null
      : new BigNumber(tezosBalance).multipliedBy(rate).decimalPlaces(2, BigNumber.ROUND_UP);
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

/**
 * @returns Total balance across all accounts in both mutez and USD
 *          or null if there are no balances (not fetched yet, for example)
 */
export const useTotalBalance = () => {
  const balancesMap = useAppSelector(s => s.assets.balances.mutez);
  const tezToDollar = useTezToDollar();

  const balances = Object.values(balancesMap);

  if (balances.length === 0) {
    return null;
  }

  const totalBalance = balances.reduce((acc, curr) => acc.plus(curr!), BigNumber(0));

  const usdBalance = tezToDollar(mutezToTez(totalBalance));

  return { mutez: totalBalance.toFixed(), usd: usdBalance };
};

export const useGetAccountBalance = () => {
  const mutezBalances = useAppSelector(s => s.assets.balances.mutez);
  return (pkh: string) => mutezBalances[pkh];
};

export const useBakerList = (): Delegate[] => useAppSelector(state => state.assets.bakers);

export const useGetBaker = () => {
  const bakers = useBakerList();
  return (rawPkh: string) => bakers.find(baker => baker.address === rawPkh);
};

export const useRefetchTrigger = () => useAppSelector(state => state.assets.refetchTrigger);

export const useIsLoading = () => useAppSelector(state => state.assets.isLoading);

export const useLastTimeUpdated = () => useAppSelector(state => state.assets.lastTimeUpdated);
