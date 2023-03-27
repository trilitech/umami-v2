import { TezosNetwork } from "@airgap/tezos";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import assetsSlice, {
  TezBalancePayload,
  TezTransfersPayload,
  TokenBalancePayload,
  TokenTransfersPayload,
} from "./store/assetsSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  getBalance,
  getTezTransfers,
  getTokenTransfers,
  getTezosPriceInUSD,
  getTokens,
} from "./tezos";

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

const assetsActions = assetsSlice.actions;

const REFRESH_RATE = 10000;
const CONVERSION_RATE_REFRESH_RATE = 300000;

export const useAssetsPolling = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((s) => s.accounts.items);
  const network = useAppSelector((s) => s.assets.network);
  const pkhs = accounts.map((a) => a.pkh);

  const tezQuery = useQuery("tezBalance", {
    queryFn: async () => {
      try {
        const balances = await Promise.all(
          pkhs.map((pkh) => getBalancePayload(pkh, network))
        );

        dispatch(assetsActions.updateAssets(balances));
      } catch (error) {
        console.error(error);
      }
    },

    refetchInterval: REFRESH_RATE,
  });

  const tokenQuery = useQuery("tokenBalance", {
    queryFn: async () => {
      try {
        const tokens = await Promise.all(
          pkhs.map((pkh) => getTokensPayload(pkh, network))
        );

        dispatch(assetsActions.updateAssets(tokens));
      } catch (error) {
        console.error(error);
      }
    },

    refetchInterval: REFRESH_RATE,
  });

  const tezTransfersQuery = useQuery("tezTransfers", {
    queryFn: async () => {
      try {
        const operations = await Promise.all(
          pkhs.map((pkh) => getTezTransfersPayload(pkh, network))
        );

        dispatch(assetsActions.updateTezOperations(operations));
      } catch (error) {
        console.error(error);
      }
    },

    refetchInterval: REFRESH_RATE,
  });

  // TODO refactor there is some duplication piling up
  const tokensTransfersQuery = useQuery("tokensTransfers", {
    queryFn: async () => {
      try {
        const operations = await Promise.all(
          pkhs.map((pkh) => getTokensTransfersPayload(pkh, network))
        );

        dispatch(assetsActions.updateTokenOperations(operations));
      } catch (error) {
        console.error(error);
      }
    },

    refetchInterval: REFRESH_RATE,
  });

  const conversionrateQuery = useQuery("conversionRate", {
    queryFn: async () => {
      try {
        const rate = await getTezosPriceInUSD();
        dispatch(assetsActions.updateConversionRate({ rate }));
      } catch (error) {
        console.error(error);
      }
    },
    refetchInterval: CONVERSION_RATE_REFRESH_RATE,
  });

  const tezQueryRef = useRef(tezQuery);
  const tokenQueryRef = useRef(tokenQuery);
  const tezTransfersQueryRef = useRef(tezTransfersQuery);
  const tokensTransfersQueryRef = useRef(tokensTransfersQuery);
  const conversionrateQueryRef = useRef(conversionrateQuery);

  // Refetch when network changes
  useEffect(() => {
    tezQueryRef.current.refetch();
    tokenQueryRef.current.refetch();
    tezTransfersQueryRef.current.refetch();
    tokensTransfersQueryRef.current.refetch();
    conversionrateQueryRef.current.refetch();
  }, [network]);
};
