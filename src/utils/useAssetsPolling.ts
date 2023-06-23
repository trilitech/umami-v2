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
  TokenBalancePayload,
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
  getTokens,
  getTokenTransfers,
} from "./tezos";
import { chunk } from "lodash";

const getTokensPayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<TokenBalancePayload> => {
  const tokens = await getTokens(pkh, network);
  return { pkh, tokens };
};

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

const REFRESH_RATE = 10000;
const BLOCK_TIME = 15000; // Block time is
const CONVERSION_RATE_REFRESH_RATE = 300000;
const MAX_ADDRESSES_PER_REQUEST = 10;

export const useAssetsPolling = () => {
  const dispatch = useAppDispatch();
  const implicitAccounts = useImplicitAccounts();
  const network = useSelectedNetwork();
  const implicitAccountPkhs = implicitAccounts.map(account => account.address.pkh);
  const multisigPkhs = useMultisigAccounts().map(multisig => multisig.address.pkh);
  const allAccountPkhs = [...implicitAccountPkhs, ...multisigPkhs];

  const tezQuery = useQuery("tezBalance", {
    queryFn: async () => {
      const pkhChunks = chunk(allAccountPkhs, MAX_ADDRESSES_PER_REQUEST);
      const accountInfos = await Promise.all(pkhChunks.flatMap(pkhs => getAccounts(pkhs, network)));
      dispatch(assetsActions.updateTezBalance(accountInfos.flat()));
    },

    refetchInterval: REFRESH_RATE,
  });

  const tokenQuery = useQuery("tokenBalance", {
    queryFn: async () => {
      const tokens = await Promise.all(
        [...multisigPkhs, ...implicitAccountPkhs].map(pkh => getTokensPayload(pkh, network))
      );

      dispatch(assetsActions.updateTokenBalance(tokens));
    },

    refetchInterval: REFRESH_RATE,
  });

  const tezTransfersQuery = useQuery("tezTransfers", {
    queryFn: async () => {
      const transfers = await Promise.all(
        implicitAccountPkhs.map(pkh => getTezTransfersPayload(pkh, network))
      );

      dispatch(assetsActions.updateTezTransfers(transfers));
    },

    refetchInterval: REFRESH_RATE,
  });

  // TODO refactor there is some duplication piling up
  const tokensTransfersQuery = useQuery("tokensTransfers", {
    queryFn: async () => {
      const transfers = await Promise.all(
        implicitAccountPkhs.map(pkh => getTokensTransfersPayload(pkh, network))
      );

      dispatch(assetsActions.updateTokenTransfers(transfers));
    },

    refetchInterval: REFRESH_RATE,
  });

  const delegationsQuery = useQuery("delegations", {
    queryFn: async () => {
      const delegations = await Promise.all(
        implicitAccountPkhs.map(pkh => getDelegationsPayload(pkh, network))
      ).then(compact);

      dispatch(assetsActions.updateDelegations(delegations));
    },

    refetchInterval: REFRESH_RATE,
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

    refetchInterval: 2000,
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
