import { TezosNetwork } from "@airgap/tezos";
import { compact } from "lodash";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useImplicitAccounts, useMultisigAccounts } from "./hooks/accountHooks";
import { useSelectedNetwork } from "./hooks/assetsHooks";
import { getOperationsForMultisigs, getRelevantMultisigContracts } from "./multisig/helpers";
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
  const multisigPkhs = useMultisigAccounts().map(multisig => multisig.address.pkh);
  const allAccountPkhs = [...implicitAccountPkhs, ...multisigPkhs];
  const pkhChunks = chunk(allAccountPkhs, MAX_ADDRESSES_PER_REQUEST);

  const tezQuery = useQuery("tezBalance", {
    queryFn: async () => {
      const accountInfos = await Promise.all(pkhChunks.flatMap(pkhs => getAccounts(pkhs, network)));
      dispatch(assetsActions.updateTezBalance(accountInfos.flat()));
    },

    refetchInterval: BLOCK_TIME,
  });

  const tokenQuery = useQuery("tokenBalance", {
    queryFn: async () => {
      const tokenBalances = await Promise.all(
        pkhChunks.map(pkhs => getTokenBalances(pkhs, network))
      );
      dispatch(assetsActions.updateTokenBalance(tokenBalances.flat()));
    },

    refetchInterval: BLOCK_TIME,
  });

  const tezTransfersQuery = useQuery("tezTransfers", {
    queryFn: async () => {
      const transfers = await Promise.all(
        implicitAccountPkhs.map(pkh => getTezTransfersPayload(pkh, network))
      );

      dispatch(assetsActions.updateTezTransfers(transfers));
    },

    refetchInterval: BLOCK_TIME,
  });

  // TODO refactor there is some duplication piling up
  const tokensTransfersQuery = useQuery("tokensTransfers", {
    queryFn: async () => {
      const transfers = await Promise.all(
        implicitAccountPkhs.map(pkh => getTokensTransfersPayload(pkh, network))
      );

      dispatch(assetsActions.updateTokenTransfers(transfers));
    },

    refetchInterval: BLOCK_TIME,
  });

  const delegationsQuery = useQuery("delegations", {
    queryFn: async () => {
      const delegations = await Promise.all(
        implicitAccountPkhs.map(pkh => getDelegationsPayload(pkh, network))
      ).then(compact);

      dispatch(assetsActions.updateDelegations(delegations));
    },

    refetchInterval: BLOCK_TIME,
  });

  const conversionrateQuery = useQuery("conversionRate", {
    queryFn: async () => {
      const rate = await getTezosPriceInUSD();
      dispatch(assetsActions.updateConversionRate({ rate }));
    },

    refetchInterval: CONVERSION_RATE_REFRESH_RATE,
  });

  const blockNumberQuery = useQuery("blockNumber", {
    queryFn: async () => {
      const number = await getLatestBlockLevel(network);
      dispatch(assetsActions.updateBlockLevel(number));
    },

    refetchInterval: BLOCK_TIME,
  });

  const multisigsQuery = useQuery("multisigs", {
    queryFn: async () => {
      const multisigs = await getRelevantMultisigContracts(network, new Set(implicitAccountPkhs));

      const multisigsWithOperations = await getOperationsForMultisigs(network, multisigs);

      dispatch(multisigActions.set(multisigsWithOperations));
    },

    refetchInterval: BLOCK_TIME,
  });

  const tezQueryRef = useRef(tezQuery);
  const tokenQueryRef = useRef(tokenQuery);
  const tezTransfersQueryRef = useRef(tezTransfersQuery);
  const tokensTransfersQueryRef = useRef(tokensTransfersQuery);
  const conversionrateQueryRef = useRef(conversionrateQuery);
  const delegationsQueryRef = useRef(delegationsQuery);
  const blockNumberQueryRef = useRef(blockNumberQuery);
  const multisigsQueryRef = useRef(multisigsQuery);

  // Refetch when network changes
  useEffect(() => {
    tezQueryRef.current.refetch();
    tokenQueryRef.current.refetch();
    tezTransfersQueryRef.current.refetch();
    tokensTransfersQueryRef.current.refetch();
    conversionrateQueryRef.current.refetch();
    delegationsQueryRef.current.refetch();
    blockNumberQueryRef.current.refetch();
    multisigsQueryRef.current.refetch();
  }, [network]);
};
