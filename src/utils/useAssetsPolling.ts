import { useQuery } from "@tanstack/react-query";

import { useRefetchTrigger } from "./hooks/assetsHooks";
import { useImplicitAccounts } from "./hooks/getAccountDataHooks";
import { useSelectedNetwork } from "./hooks/networkHooks";
import { getPendingOperationsForMultisigs, getRelevantMultisigContracts } from "./multisig/helpers";
import { Multisig } from "./multisig/types";
import { useAppDispatch } from "./redux/hooks";
import { assetsActions } from "./redux/slices/assetsSlice";
import { multisigActions } from "./redux/slices/multisigsSlice";
import { tokensActions } from "./redux/slices/tokensSlice";
import { AppDispatch } from "./redux/store";
import {
  getAccounts,
  getBakers,
  getLatestBlockLevel,
  getTezosPriceInUSD,
  getTokenBalances,
} from "./tezos";
import { useReactQueryErrorHandler } from "./useReactQueryOnError";
import { RawPkh } from "../types/Address";
import { Network } from "../types/Network";

export const BLOCK_TIME = 15000; // Block time is
const CONVERSION_RATE_REFRESH_RATE = 300000;
const BAKERS_REFRESH_RATE = 1000 * 60 * 120;

const updatePendingOperations = async (
  dispatch: AppDispatch,
  network: Network,
  multisigs: Multisig[]
) => {
  const pendingOperations = await getPendingOperationsForMultisigs(multisigs, network);
  dispatch(multisigActions.setPendingOperations(pendingOperations.flat()));
};

const updateTezBalances = async (dispatch: AppDispatch, network: Network, addresses: RawPkh[]) => {
  const accountInfos = await getAccounts(addresses, network);
  dispatch(assetsActions.updateTezBalance(accountInfos.flat()));
};

const updateTokenBalances = async (dispatch: AppDispatch, network: Network, pkhs: RawPkh[]) => {
  const tokenBalances = await getTokenBalances(pkhs, network);
  const tokens = tokenBalances.flat().map(({ token, lastLevel }) => ({ ...token, lastLevel }));
  dispatch(tokensActions.addTokens({ network, tokens }));
  dispatch(assetsActions.updateTokenBalance(tokenBalances.flat()));
};

const updateAccountAssets = async (
  dispatch: AppDispatch,
  network: Network,
  implicitAccountAddresses: RawPkh[]
) => {
  try {
    dispatch(assetsActions.setIsLoading(true));
    const multisigs = await getRelevantMultisigContracts(
      new Set(implicitAccountAddresses),
      network
    );
    dispatch(multisigActions.setMultisigs(multisigs));

    const allAccountAddresses = [
      ...implicitAccountAddresses,
      ...multisigs.map(acc => acc.address.pkh),
    ];

    // all these requests should happen only after we fetched the multisigs
    // otherwise, we might miss multisig operations until after the next fetch happens
    await Promise.all([
      updatePendingOperations(dispatch, network, multisigs),
      updateTezBalances(dispatch, network, allAccountAddresses),
      updateTokenBalances(dispatch, network, allAccountAddresses),
    ]);
    dispatch(assetsActions.setLastTimeUpdated(new Date().toUTCString()));
    return null;
  } finally {
    dispatch(assetsActions.setIsLoading(false));
  }
};

const updateConversionRate = async (dispatch: AppDispatch) => {
  const rate = await getTezosPriceInUSD();
  dispatch(assetsActions.updateConversionRate(rate));
  return null;
};

const updateBlockLevel = async (dispatch: AppDispatch, network: Network) => {
  const blockLevel = await getLatestBlockLevel(network);
  dispatch(assetsActions.updateBlockLevel(blockLevel));
  return null;
};

const updateBakers = async (dispatch: AppDispatch, network: Network) => {
  const rawBakers = await getBakers(network);
  const bakers = rawBakers.map(({ address, alias, stakingBalance }) => ({
    address: address as string,
    stakingBalance: stakingBalance as number,
    name: alias ?? "Unknown baker",
  }));
  dispatch(assetsActions.updateBakers(bakers));

  return null;
};

export const useAssetsPolling = () => {
  const dispatch = useAppDispatch();
  const implicitAccounts = useImplicitAccounts();
  const refetchTrigger = useRefetchTrigger();
  const network = useSelectedNetwork();
  const handleError = useReactQueryErrorHandler();

  const implicitAddresses = implicitAccounts.map(account => account.address.pkh);

  const { error: allAssetsError } = useQuery({
    queryKey: ["allAssets", dispatch, network, implicitAddresses, refetchTrigger],
    queryFn: () => updateAccountAssets(dispatch, network, implicitAddresses),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const { error: conversionRateError } = useQuery({
    queryKey: ["conversionRate", dispatch],
    queryFn: () => updateConversionRate(dispatch),
    refetchInterval: CONVERSION_RATE_REFRESH_RATE,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const { error: blockNumberError } = useQuery({
    queryKey: ["blockNumber", dispatch, network],
    queryFn: () => updateBlockLevel(dispatch, network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const { error: bakersError } = useQuery({
    queryKey: ["bakers", dispatch, network],
    queryFn: () => updateBakers(dispatch, network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BAKERS_REFRESH_RATE,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  handleError(allAssetsError);
  handleError(conversionRateError);
  handleError(blockNumberError);
  handleError(bakersError);
};
