import { TezosNetwork } from "@airgap/tezos";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { filterNulls } from "./helpers";
import { useAccounts } from "./hooks/accountHooks";
import { useSelectedNetwork } from "./hooks/assetsHooks";
import assetsSlice, {
  DelegationPayload,
  TezBalancePayload,
  TezTransfersPayload,
  TokenBalancePayload,
  TokenTransfersPayload,
} from "./store/assetsSlice";
import { useAppDispatch } from "./store/hooks";
import { getBalance, getLastDelegation, getLatestBlockLevel, getTezTransfers, getTezosPriceInUSD, getTokenTransfers, getTokens } from "./tezos/fetch";

// TODO: refactor with less repetitions
const getBalancePayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<TezBalancePayload> => {
  const tez = await getBalance(pkh, network);
  return { pkh, tez };
};

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
  const operations = await getTezTransfers(pkh, network);
  return { pkh, operations };
};
const getTokensTransfersPayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<TokenTransfersPayload> => {
  const operations = await getTokenTransfers(pkh, network);
  return { pkh, operations };
};

const getDelegationsPayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<DelegationPayload | undefined> => {
  const delegation = await getLastDelegation(pkh, network);
  return delegation && { pkh, delegation };
};

const assetsActions = assetsSlice.actions;

const REFRESH_RATE = 10000;
const BLOCK_TIME = 15000; // Block time is
const CONVERSION_RATE_REFRESH_RATE = 300000;

export const useAssetsPolling = () => {
  const dispatch = useAppDispatch();
  const accounts = useAccounts();
  const network = useSelectedNetwork();
  const pkhs = accounts.map((a) => a.pkh);

  const tezQuery = useQuery("tezBalance", {
    queryFn: async () => {
      const balances = await Promise.all(
        pkhs.map((pkh) => getBalancePayload(pkh, network))
      );

      dispatch(assetsActions.updateAssets(balances));
    },

    refetchInterval: REFRESH_RATE,
  });

  const tokenQuery = useQuery("tokenBalance", {
    queryFn: async () => {
      const tokens = await Promise.all(
        pkhs.map((pkh) => getTokensPayload(pkh, network))
      );

      dispatch(assetsActions.updateAssets(tokens));
    },

    refetchInterval: REFRESH_RATE,
  });

  const tezTransfersQuery = useQuery("tezTransfers", {
    queryFn: async () => {
      const operations = await Promise.all(
        pkhs.map((pkh) => getTezTransfersPayload(pkh, network))
      );

      dispatch(assetsActions.updateTezOperations(operations));
    },

    refetchInterval: REFRESH_RATE,
  });

  // TODO refactor there is some duplication piling up
  const tokensTransfersQuery = useQuery("tokensTransfers", {
    queryFn: async () => {
      const operations = await Promise.all(
        pkhs.map((pkh) => getTokensTransfersPayload(pkh, network))
      );

      dispatch(assetsActions.updateTokenOperations(operations));
    },

    refetchInterval: REFRESH_RATE,
  });

  const delegationsQuery = useQuery("delegations", {
    queryFn: async () => {
      const delegations = await Promise.all(
        pkhs.map((pkh) => getDelegationsPayload(pkh, network))
      ).then(filterNulls);

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

  const tezQueryRef = useRef(tezQuery);
  const tokenQueryRef = useRef(tokenQuery);
  const tezTransfersQueryRef = useRef(tezTransfersQuery);
  const tokensTransfersQueryRef = useRef(tokensTransfersQuery);
  const conversionrateQueryRef = useRef(conversionrateQuery);
  const delegationsQueryRef = useRef(delegationsQuery);
  const blockNumberQueryRef = useRef(blockNumberQuery);

  // Refetch when network changes
  useEffect(() => {
    tezQueryRef.current.refetch();
    tokenQueryRef.current.refetch();
    tezTransfersQueryRef.current.refetch();
    tokensTransfersQueryRef.current.refetch();
    conversionrateQueryRef.current.refetch();
    delegationsQueryRef.current.refetch();
    blockNumberQueryRef.current.refetch();
  }, [network]);
};
