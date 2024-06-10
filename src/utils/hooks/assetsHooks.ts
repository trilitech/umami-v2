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
import { TokenTransferOperation } from "../tezos";

const useGetAccountStates = () => useAppSelector(s => s.assets.accountStates);

export const useGetAccountState = () => {
  const accountStates = useGetAccountStates();
  return (pkh: string) => accountStates[pkh];
};

export const useGetAccountDelegate = () => {
  const getAccountState = useGetAccountState();
  return (pkh: string) => getAccountState(pkh)?.delegate;
};

export const useGetAccountBalance = () => {
  const getAccountState = useGetAccountState();

  return (pkh: string) => {
    const state = getAccountState(pkh);
    if (!state) {
      return undefined;
    }
    return state.balance;
  };
};

// Tenderbake guarantees block finality after 2 confirmations
export const useIsBlockFinalised = (level: number) => {
  const currentLevel = useAppSelector(s => s.assets.block.level);

  return currentLevel ? currentLevel - level >= 2 : null;
};

export const useAllNfts = (): Record<RawPkh, NFTBalance[] | undefined> => {
  const getAccountNFTs = useGetAccountNFTs();
  const accountStates = useGetAccountStates();

  return fromPairs(Object.keys(accountStates).map(address => [address, getAccountNFTs(address)]));
};

const useGetAccountAssets = () => {
  const getToken = useGetToken();
  const getAccountState = useGetAccountState();

  return (pkh: string): TokenBalanceWithToken[] => {
    const tokenBalances = getAccountState(pkh)?.tokens || [];

    return compact(
      tokenBalances.map(({ contract, tokenId, ...rest }) => {
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
  return (transactionId: number): TokenTransferOperation | undefined => {
    const transfer = tokenTransfers[transactionId];
    return transfer && { ...transfer, type: "token_transfer" };
  };
};

const useConversionRate = () => useAppSelector(s => s.assets.conversionRate);

const useTezToDollar = () => {
  const rate = useConversionRate();

  if (!rate) {
    return () => undefined;
  }

  // tezosBalance is in tez
  return (tezosBalance: string): BigNumber =>
    BigNumber(tezosBalance).multipliedBy(rate).decimalPlaces(2, BigNumber.ROUND_UP);
};

export const useGetDollarBalance = () => {
  const tezToDollar = useTezToDollar();

  const getAccountBalance = useGetAccountBalance();

  return (pkh: string) => {
    const mutezBalance = getAccountBalance(pkh);

    return mutezBalance === undefined ? undefined : tezToDollar(mutezToTez(mutezBalance).toFixed());
  };
};

/**
 * @returns Total balance across all accounts in both mutez and USD
 *          or null if there are no balances (not fetched yet, for example)
 */
export const useTotalBalance = () => {
  const accountStates = useGetAccountStates();
  const tezToDollar = useTezToDollar();

  const balances = Object.values(accountStates);

  if (balances.length === 0) {
    return null;
  }

  const totalBalance = balances.reduce((acc, curr) => acc.plus(curr?.balance || 0), BigNumber(0));

  const usdBalance = tezToDollar(mutezToTez(totalBalance).toFixed());

  return { mutez: totalBalance.toFixed(), usd: usdBalance };
};

export const useBakerList = (): Delegate[] => useAppSelector(state => state.assets.bakers);

export const useGetBaker = () => {
  const bakers = useBakerList();
  return (rawPkh: string) => bakers.find(baker => baker.address === rawPkh);
};

export const useRefetchTrigger = () => useAppSelector(state => state.assets.refetchTrigger);

export const useIsLoading = () => useAppSelector(state => state.assets.isLoading);

export const useLastTimeUpdated = () => useAppSelector(state => state.assets.lastTimeUpdated);
