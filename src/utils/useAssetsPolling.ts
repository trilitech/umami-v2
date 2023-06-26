import { TezosNetwork } from "@airgap/tezos";
import { compact } from "lodash";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useImplicitAccounts } from "./hooks/accountHooks";
import { useSelectedNetwork } from "./hooks/assetsHooks";
import { getPendingOperationsForMultisigs, getRelevantMultisigContracts } from "./multisig/helpers";
import {
  assetsActions,
  DelegationPayload,
  TezTransfersPayload,
  TokenTransfersPayload,
} from "./store/assetsSlice";
import { useAppDispatch } from "./store/hooks";
import { multisigActions } from "./store/multisigsSlice";
import {
  getAccounts,
  getLastDelegation,
  getLatestBlockLevel,
  getTezosPriceInUSD,
  getTezTransfers,
  getTokenBalances,
  getTokenTransfers,
} from "./tezos";
import { chunk } from "lodash";
import { processInBatches } from "./promise";

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
  return { pkh, transfers };
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

// The limit of a URI size is 2000 chars
// according to https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
// alongside addresses we also pass the host, path, other params, at most 200 chars
// roughly, an address is 40 chars.
const MAX_ADDRESSES_PER_REQUEST = 40;

export const useAssetsPolling = () => {
  const dispatch = useAppDispatch();
  const implicitAccounts = useImplicitAccounts();
  const network = useSelectedNetwork();
  const implicitAccountPkhs = implicitAccounts.map(account => account.address.pkh);

  const accountAssetsQuery = useQuery("allAssets", {
    queryFn: async () => {
      const multisigs = await getRelevantMultisigContracts(network, new Set(implicitAccountPkhs));

      const pendingOperations = getPendingOperationsForMultisigs(network, multisigs).then(
        multisigsWithOperations => {
          dispatch(multisigActions.set(multisigsWithOperations));
        }
      );

      const allAccountPkhs = [...implicitAccountPkhs, ...multisigs.map(acc => acc.address)];
      const pkhChunks = chunk(allAccountPkhs, MAX_ADDRESSES_PER_REQUEST);

      const tezBalances = Promise.all(pkhChunks.flatMap(pkhs => getAccounts(pkhs, network))).then(
        accountInfos => {
          dispatch(assetsActions.updateTezBalance(accountInfos.flat()));
        }
      );

      const tokens = Promise.all(pkhChunks.map(pkhs => getTokenBalances(pkhs, network))).then(
        async tokenBalances => {
          dispatch(assetsActions.updateTokenBalance(tokenBalances.flat()));

          // token transfers have to be fetched after the balances were fetched
          // because otherwise we might not have some tokens' info to display the operations
          processInBatches(allAccountPkhs, 5, pkh => getTokensTransfersPayload(pkh, network)).then(
            tokenTransfers => {
              dispatch(assetsActions.updateTokenTransfers(tokenTransfers));
            }
          );
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

      return Promise.all([pendingOperations, tezBalances, tokens, tezTransfers, delegations]);
    },

    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
  });

  const conversionrateQuery = useQuery("conversionRate", {
    queryFn: async () => {
      const rate = await getTezosPriceInUSD();
      dispatch(assetsActions.updateConversionRate({ rate }));
    },

    refetchInterval: CONVERSION_RATE_REFRESH_RATE,
    refetchIntervalInBackground: true,
  });

  const blockNumberQuery = useQuery("blockNumber", {
    queryFn: async () => {
      const number = await getLatestBlockLevel(network);
      dispatch(assetsActions.updateBlockLevel(number));
    },

    refetchInterval: BLOCK_TIME,
    refetchIntervalInBackground: true,
  });

  const conversionRateQueryRef = useRef(conversionrateQuery);
  const blockNumberQueryRef = useRef(blockNumberQuery);
  const accountAssetsQueryRef = useRef(accountAssetsQuery);

  // Refetch when network changes
  // TODO: implement proper query cancellation
  //       otherwise we might change the network in the middle of
  //       receiving data and the data will be broken
  // https://app.asana.com/0/1204165186238194/1204890035700189/f
  useEffect(() => {
    conversionRateQueryRef.current.refetch();
    blockNumberQueryRef.current.refetch();
    accountAssetsQueryRef.current.refetch();
  }, [network]);
};
