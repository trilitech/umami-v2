import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Network } from "../types/Network";
import { useImplicitAccounts } from "./hooks/accountHooks";
import { useRefetchTrigger } from "./hooks/assetsHooks";
import { getPendingOperationsForMultisigs, getRelevantMultisigContracts } from "./multisig/helpers";
import { assetsActions } from "./redux/slices/assetsSlice";
import { useAppDispatch } from "./redux/hooks";
import { multisigActions } from "./redux/slices/multisigsSlice";
import { tokensActions } from "./redux/slices/tokensSlice";
import {
  getAccounts,
  getBakers,
  getLatestBlockLevel,
  getTezosPriceInUSD,
  getTokenBalances,
} from "./tezos";
import errorsSlice from "./redux/slices/errorsSlice";
import getErrorContext from "./getErrorContext";
import { useSelectedNetwork } from "./hooks/networkHooks";
import { AppDispatch } from "./redux/store";
import { RawPkh } from "../types/Address";
import { useToast } from "@chakra-ui/react";
import { Multisig } from "./multisig/types";

const BLOCK_TIME = 15000; // Block time is
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
  const tokens = tokenBalances.flat().map(b => b.token);

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
  } finally {
    dispatch(assetsActions.setIsLoading(false));
  }
};

const updateConversionRate = async (dispatch: AppDispatch) => {
  const rate = await getTezosPriceInUSD();
  dispatch(assetsActions.updateConversionRate({ rate }));
};

const updateBlockLevel = async (dispatch: AppDispatch, network: Network) => {
  const blockLevel = await getLatestBlockLevel(network);
  dispatch(assetsActions.updateBlockLevel(blockLevel));
};

const updateBakers = async (dispatch: AppDispatch, network: Network) => {
  const rawBakers = await getBakers(network);
  const bakers = rawBakers.map(({ address, alias, stakingBalance }) => ({
    address: address as string,
    stakingBalance: stakingBalance as number,
    name: alias ?? "Unknown baker",
  }));
  dispatch(assetsActions.updateBakers(bakers));
};

export const useAssetsPolling = () => {
  const dispatch = useAppDispatch();
  const implicitAccounts = useImplicitAccounts();
  const refetchTrigger = useRefetchTrigger();
  const network = useSelectedNetwork();
  const queryClient = useQueryClient();
  const toast = useToast();

  const implicitAddresses = implicitAccounts.map(account => account.address.pkh);

  const accountAssetsQuery = useQuery("allAssets", {
    queryFn: () => updateAccountAssets(dispatch, network, implicitAddresses),
    onError: (error: any) => {
      dispatch(errorsSlice.actions.add(getErrorContext(error)));
      toast({
        title: "Data fetching error",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    },
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const conversionrateQuery = useQuery("conversionRate", {
    queryFn: () => updateConversionRate(dispatch),
    refetchInterval: CONVERSION_RATE_REFRESH_RATE,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const blockNumberQuery = useQuery("blockNumber", {
    queryFn: () => updateBlockLevel(dispatch, network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const bakersQuery = useQuery("bakers", {
    queryFn: () => updateBakers(dispatch, network),
    retry: false, // retries are handled by the underlying functions
    refetchInterval: BAKERS_REFRESH_RATE,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const conversionRateQueryRef = useRef(conversionrateQuery);
  const blockNumberQueryRef = useRef(blockNumberQuery);
  const accountAssetsQueryRef = useRef(accountAssetsQuery);
  const bakersQueryRef = useRef(bakersQuery);

  useEffect(() => {
    queryClient.cancelQueries({ queryKey: "allAssets" });
    queryClient.cancelQueries({ queryKey: "conversionRate" });
    queryClient.cancelQueries({ queryKey: "blockNumber" });
    queryClient.cancelQueries({ queryKey: "bakers" });

    conversionRateQueryRef.current.refetch();
    blockNumberQueryRef.current.refetch();
    accountAssetsQueryRef.current.refetch();
    bakersQueryRef.current.refetch();
  }, [network, refetchTrigger, queryClient]);
};
