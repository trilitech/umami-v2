import { TezosNetwork } from "@airgap/tezos";
import {
  OpKind,
  ParamsWithKind,
  Signer,
  TezosToolkit,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { TezTransfer, TokenTransfer } from "../types/Operation";

import { InMemorySigner } from "@taquito/signer";
import * as tzktApi from "@tzkt/sdk-api";
import { DelegationOperation } from "@tzkt/sdk-api";
import axios from "axios";
import { TransactionValues } from "../components/sendForm/types";
import { Baker } from "../types/Baker";
import { Token } from "../types/Token";
import { DummySigner } from "./dummySigner";
import { LedgerSigner, HDPathTemplate } from '@taquito/ledger-signer';
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { SignerConfig, SignerType } from "../types/SignerConfig";

const nodeUrls = {
  [TezosNetwork.GHOSTNET]: `https://ghostnet.ecadinfra.com`,
  [TezosNetwork.MAINNET]: `https://mainnet.api.tez.ie`,
};

const tzktUrls = {
  [TezosNetwork.GHOSTNET]: `https://api.ghostnet.tzkt.io`,
  [TezosNetwork.MAINNET]: `https://api.mainnet.tzkt.io`,
};

const coincapUrl = "https://api.coincap.io/v2/assets";

export const addressExists = async (
  pkh: string,
  network = TezosNetwork.MAINNET
) => {
  // Temporary solution to check address existence
  const Tezos = new TezosToolkit(nodeUrls[network]);
  const balance = await Tezos.tz.getBalance(pkh);
  return !balance.isZero();
};

const makeToolkitWithSigner = async (config: SignerConfig) => {
  const Tezos = new TezosToolkit(nodeUrls[config.network]);
  if (config.type === SignerType.SK) {
    Tezos.setProvider({
      signer: new InMemorySigner(config.sk),
    });
  } else {
    // Close existing connections to be able to reinitiate
    const devices = await TransportWebHID.list()
    for (let i = 0; i < devices.length; i++) {
      devices[i].close()
    }
    const transport = await TransportWebHID.create()
    Tezos.setProvider({
      signer: new LedgerSigner(
        transport,
        HDPathTemplate(config.account),
        false, // PK Verification not needed
        config.derivationType
      )
    })
  }
  return Tezos;
};

export const makeToolkitWithDummySigner = (
  pk: string,
  pkh: string,
  network: TezosNetwork
) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  Tezos.setProvider({
    signer: new DummySigner(pk, pkh) as any,
  });
  return Tezos;
};

/**
 * Fetch balances
 */
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

// Temporary solution for generating fingerprint for seedphrase
// https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
export async function getFingerPrint(seedPhrase: string) {
  const utf8 = new TextEncoder().encode(seedPhrase);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

type FA2TokenTransferParams = {
  sender: string;
  recipient: string;
  contract: string;
  tokenId: string;
  amount: number;
};

/**
 *  Contract factory
 */
const makeContract = async (
  { sender, recipient, tokenId, amount, contract }: FA2TokenTransferParams,
  toolkit: TezosToolkit
) => {
  const michelson = [
    {
      from_: sender,
      txs: [
        {
          to_: recipient,
          token_id: tokenId,
          amount: amount,
        },
      ],
    },
  ];

  const contractInstance = await toolkit.contract.at(contract);
  return contractInstance.methods.transfer(michelson);
};

/**
 * Estimation methods
 */
export const estimateTezTransfer = async (
  senderPkh: string,
  recipient: string,
  amount: number,
  senderPk: string,
  network: TezosNetwork
) => {
  const Tezos = makeToolkitWithDummySigner(senderPk, senderPkh, network);
  return Tezos.estimate.transfer({
    to: recipient,
    amount: amount,
  });
};

export const estimateFA2transfer = async (
  params: FA2TokenTransferParams,
  senderPk: string,
  network: TezosNetwork
) => {
  const Tezos = makeToolkitWithDummySigner(senderPk, params.sender, network);

  const contractInstance = await makeContract(params, Tezos);

  return Tezos.estimate.transfer(contractInstance.toTransferParams());
};

export const estimateDelegation = async (
  senderPkh: string,
  bakerPkh: string | undefined,
  senderPk: string,
  network: TezosNetwork
) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  Tezos.setProvider({
    signer: new DummySigner(senderPk, senderPkh) as any as Signer,
  });

  return Tezos.estimate.setDelegate({ source: senderPkh, delegate: bakerPkh });
};

export const estimateBatch = async (
  transactions: TransactionValues[],
  pkh: string,
  pk: string,
  network: TezosNetwork
) => {
  const batch = await transactionValuesToBatchParams(transactions, pk, network);

  const Tezos = await makeToolkitWithDummySigner(pk, pkh, network);

  return Tezos.estimate.batch(batch);
};

export const delegate = async (
  senderPkh: string,
  bakerPkh: string | undefined,
  config: SignerConfig
) => {
  const Tezos = await makeToolkitWithSigner(config);
  return Tezos.contract.setDelegate({
    source: senderPkh,
    delegate: bakerPkh,
  });
};

/**
 * Transfer execution methods
 */

export const transferFA2Token = async (
  params: FA2TokenTransferParams,
  config: SignerConfig
) => {
  const Tezos = await makeToolkitWithSigner(config);
  const contractInstance = await makeContract(params, Tezos);
  return contractInstance.send();
};

export const transferTez = async (
  recipient: string,
  amount: number,
  config: SignerConfig
) => {
  const Tezos = await makeToolkitWithSigner(config);
  return Tezos.contract.transfer({ to: recipient, amount });
};

export const submitBatch = async (
  transactions: TransactionValues[],
  config: SignerConfig
) => {
  const Tezos = await makeToolkitWithSigner(config);
  const params = await transactionValuesToWalletParams(transactions, Tezos);
  return Tezos.wallet.batch(params).send();
};

/**
 *  Fetch tez and token transfers
 */
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
  type coinCapResponseType = {
    data: {
      priceUsd?: number;
    };
  };

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

export const getBakers = () => {
  return axios
    .get("https://api.baking-bad.org/v2/bakers")
    .then((d) => d.data) as Promise<Baker[]>;
};

// Why are params slightly different for estimation and execution??
// WalletParamsWithKind !== ParamsWithKind
// It makes us make two different transformations that are almost identical.
// TODO refactor
export const transactionValuesToWalletParams = async (
  transactions: TransactionValues[],
  signer: TezosToolkit
): Promise<WalletParamsWithKind[]> => {
  const result: WalletParamsWithKind[] = [];

  for (const transaction of transactions) {
    const type = transaction.type;
    switch (type) {
      case "tez":
        result.push({
          kind: OpKind.TRANSACTION,
          to: transaction.values.recipient,
          amount: transaction.values.amount,
        });
        break;
      case "delegation":
        result.push({
          kind: OpKind.DELEGATION,
          delegate: transaction.values.recipient,
        });
        break;
      case "nft":
        {
          const Tezos = signer;
          const contract = await makeContract(
            {
              sender: transaction.values.sender,
              amount: transaction.values.amount,
              contract: transaction.data.contract,
              recipient: transaction.values.recipient,
              tokenId: transaction.data.tokenId,
            },
            Tezos
          );
          result.push({
            kind: OpKind.TRANSACTION,
            ...contract.toTransferParams(),
          });
        }
        break;
      default: {
        const exhaustiveCheck: never = type;
        throw new Error(exhaustiveCheck);
      }
    }
  }

  return result;
};

export const transactionValuesToParams = async (
  transactions: TransactionValues[],
  signer: TezosToolkit
): Promise<ParamsWithKind[]> => {
  const result: ParamsWithKind[] = [];

  for (const transaction of transactions) {
    const type = transaction.type;
    switch (type) {
      case "tez":
        result.push({
          kind: OpKind.TRANSACTION,
          to: transaction.values.recipient,
          amount: transaction.values.amount,
        });
        break;
      case "delegation":
        result.push({
          kind: OpKind.DELEGATION,
          source: transaction.values.sender,
          delegate: transaction.values.recipient,
        });
        break;
      case "nft":
        {
          const Tezos = signer;
          const contract = await makeContract(
            {
              sender: transaction.values.sender,
              amount: transaction.values.amount,
              contract: transaction.data.contract,
              recipient: transaction.values.recipient,
              tokenId: transaction.data.tokenId,
            },
            Tezos
          );
          result.push({
            kind: OpKind.TRANSACTION,
            ...contract.toTransferParams(),
          });
        }
        break;
      default: {
        const exhaustiveCheck: never = type;
        throw new Error(exhaustiveCheck);
      }
    }
  }

  return result;
};

export const transactionValuesToBatchParams = async (
  transactions: TransactionValues[],
  pk: string,
  network: TezosNetwork
): Promise<ParamsWithKind[]> => {
  const first = transactions[0];
  const Tezos = makeToolkitWithDummySigner(pk, first.values.sender, network);

  return transactionValuesToParams(transactions, Tezos);
};
