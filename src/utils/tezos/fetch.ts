import { TezosNetwork } from "@airgap/tezos";
import {
  blocksGetCount,
  DelegationOperation,
  Token,
  TokenTransfer,
} from "@tzkt/sdk-api";
import axios from "axios";
import { coincapUrl, nodeUrls, tzktUrls } from "./consts";
import { coinCapResponseType } from "./types";
import * as tzktApi from "@tzkt/sdk-api";
import { TezosToolkit } from "@taquito/taquito";
import { Baker } from "../../types/Baker";
import { TezTransfer } from "../../types/Operation";

export const getBalance = async (pkh: string, network: TezosNetwork) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  return Tezos.tz.getBalance(pkh);
};

export const getTokens = (pkh: string, network: TezosNetwork) =>
  tzktApi.tokensGetTokenBalances(
    {
      account: { eq: pkh },
    },
    {
      baseUrl: tzktUrls[network],
    }
  ) as Promise<Token[]>;

export const getTezTransfers = (
  address: string,
  network = TezosNetwork.MAINNET
): Promise<TezTransfer[]> => {
  return tzktApi.operationsGetTransactions(
    {
      anyof: { fields: ["sender", "target"], eq: address },
      sort: { desc: "level" },
      limit: 10,
    },
    {
      baseUrl: tzktUrls[network],
    }
  );
};

export const getTokenTransfers = (
  address: string,
  network = TezosNetwork.MAINNET
): Promise<TokenTransfer[]> => {
  return tzktApi.tokensGetTokenTransfers(
    {
      anyof: { fields: ["from", "to"], eq: address },
      sort: { desc: "level" },
      limit: 10,
    },
    {
      baseUrl: tzktUrls[network],
    }
  );
};

export const getLastDelegation = async (
  address: string,
  network = TezosNetwork.MAINNET
) => {
  return tzktApi
    .operationsGetDelegations(
      {
        sender: { eq: address },
        sort: { desc: "level" },
        limit: 1,
      },
      {
        baseUrl: tzktUrls[network],
      }
    )
    .then((d) => d[0]) as Promise<DelegationOperation | undefined>;
};

// Fetch the tezos price in usd from the CoinCap API.
// The CoinCap API documentation: https://docs.coincap.io
export const getTezosPriceInUSD = async (): Promise<number | null> => {
  const {
    data: {
      data: { priceUsd },
    },
  } = await axios<coinCapResponseType>({
    method: "get",
    url: `${coincapUrl}/tezos`,
  });

  return priceUsd ?? null;
};

export const getLatestBlockLevel = async (
  network = TezosNetwork.MAINNET
): Promise<number> => {
  return await blocksGetCount({
    baseUrl: tzktUrls[network],
  });
};

export const getBakers = () => {
  return axios
    .get("https://api.baking-bad.org/v2/bakers")
    .then((d) => d.data) as Promise<Baker[]>;
};
