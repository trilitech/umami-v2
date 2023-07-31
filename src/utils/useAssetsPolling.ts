import { chunk, compact } from "lodash";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TezosNetwork } from "../types/TezosNetwork";
import { TokenTransfer } from "../types/Transfer";
import { useImplicitAccounts } from "./hooks/accountHooks";
import { useRefetchTrigger, useSelectedNetwork } from "./hooks/assetsHooks";
import { getPendingOperationsForMultisigs, getRelevantMultisigContracts } from "./multisig/helpers";
import { processInBatches } from "./promise";
import {
  assetsActions,
  DelegationPayload,
  TezTransfersPayload,
  TokenTransfersPayload,
} from "./redux/slices/assetsSlice";
import { useAppDispatch } from "./redux/hooks";
import { multisigActions } from "./redux/slices/multisigsSlice";
import { tokensActions } from "./redux/slices/tokensSlice";
import {
  getAccounts,
  getBakers,
  getLastDelegation,
  getLatestBlockLevel,
  getTezosPriceInUSD,
  getTezTransfers,
  getTokenBalances,
  getTokenTransfers,
} from "./tezos";

const getTezTransfersPayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<TezTransfersPayload> => {
  const transfers = await getTezTransfers(pkh, network);
  return { pkh, transfers };
};
const getTokensTransfersPayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<TokenTransfersPayload> => {
  const transfers = await getTokenTransfers(pkh, network);
  // there are no token transfers without a token & amount assigned
  return { pkh, transfers: transfers as TokenTransfer[] };
};

const getDelegationsPayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<DelegationPayload | undefined> => {
  const delegation = await getLastDelegation(pkh, network);
  return delegation && { pkh, delegation };
};

const BLOCK_TIME = 15000; // Block time is
const CONVERSION_RATE_REFRESH_RATE = 300000;
const BAKERS_REFRESH_RATE = 1000 * 60 * 120;

// The limit of a URI size is 2000 chars
// according to https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
// alongside addresses we also pass the host, path, other params, at most 200 chars
// roughly, an address is 40 chars.
const MAX_ADDRESSES_PER_REQUEST = 40;
// Each bigmap id takes up 6 chars.
const MAX_BIGMAP_PER_REQUEST = 300;

export const useAssetsPolling = () => {
  const dispatch = useAppDispatch();
  const implicitAccounts = useImplicitAccounts();
  const refetchTrigger = useRefetchTrigger();
  const network = useSelectedNetwork();
  const queryClient = useQueryClient();

  const implicitAccountPkhs = implicitAccounts.map(account => account.address.pkh);

  const accountAssetsQuery = useQuery("allAssets", {
    queryFn: async () => {
      try {
        dispatch(assetsActions.setIsLoading(true));
        const multisigs = await getRelevantMultisigContracts(new Set(implicitAccountPkhs), network);
        dispatch(multisigActions.setMultisigs(multisigs));

        const multisigChunks = chunk(multisigs, MAX_BIGMAP_PER_REQUEST);
        const pendingOperations = Promise.all(
          multisigChunks.map(multisigs => getPendingOperationsForMultisigs(multisigs, network))
        ).then(pendingOperations => {
          dispatch(multisigActions.setPendingOperations(pendingOperations.flat()));
        });

        const allAccountPkhs = [...implicitAccountPkhs, ...multisigs.map(acc => acc.address.pkh)];
        const pkhChunks = chunk(allAccountPkhs, MAX_ADDRESSES_PER_REQUEST);
        const tezBalances = Promise.all(pkhChunks.map(pkhs => getAccounts(pkhs, network))).then(
          accountInfos => {
            dispatch(assetsActions.updateTezBalance(accountInfos.flat()));
          }
        );

        const tokens = Promise.all(pkhChunks.map(pkhs => getTokenBalances(pkhs, network))).then(
          async tokenBalances => {
            dispatch(
              tokensActions.addTokens({ network, tokens: tokenBalances.flat().map(b => b.token) })
            );
            dispatch(assetsActions.updateTokenBalance(tokenBalances.flat()));

            // token transfers have to be fetched after the balances were fetched
            // because otherwise we might not have some tokens' info to display the operations
            processInBatches(allAccountPkhs, 5, pkh =>
              getTokensTransfersPayload(pkh, network)
            ).then(tokenTransfers => {
              dispatch(
                tokensActions.addTokens({
                  network,
                  tokens: tokenTransfers.flatMap(x => x.transfers).map(b => b.token),
                })
              );
              dispatch(assetsActions.updateTokenTransfers(tokenTransfers));
            });
          }
        );

        const tezTransfers = processInBatches(allAccountPkhs, 5, pkh =>
          getTezTransfersPayload(pkh, network)
        ).then(tezTransfers => {
          dispatch(assetsActions.updateTezTransfers(tezTransfers));
        });

        const delegations = processInBatches(allAccountPkhs, 5, pkh =>
          getDelegationsPayload(pkh, network)
        ).then(delegations => {
          dispatch(assetsActions.updateDelegations(compact(delegations)));
        });

        await Promise.all([pendingOperations, tezBalances, tokens, tezTransfers, delegations]).then(
          () => {
            dispatch(assetsActions.setLastTimeUpdated(new Date().toUTCString()));
          }
        );
      } catch (error: any) {
        console.warn(error);
      } finally {
        dispatch(assetsActions.setIsLoading(false));
      }
    },

    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const conversionrateQuery = useQuery("conversionRate", {
    queryFn: async () => {
      const rate = await getTezosPriceInUSD();
      dispatch(assetsActions.updateConversionRate({ rate }));
    },

    refetchInterval: CONVERSION_RATE_REFRESH_RATE,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const blockNumberQuery = useQuery("blockNumber", {
    queryFn: async () => {
      const number = await getLatestBlockLevel(network);
      dispatch(assetsActions.updateBlockLevel(number));
    },

    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const bakersQuery = useQuery("bakers", {
    queryFn: async () => {
      if (network !== TezosNetwork.MAINNET) {
        return;
      }

      const bakers = await getBakers();
      dispatch(assetsActions.updateBakers(bakers));
    },
    refetchInterval: BAKERS_REFRESH_RATE,
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
