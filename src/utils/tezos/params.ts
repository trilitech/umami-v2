import { TezosNetwork } from "@airgap/tezos";
import {
  OpKind,
  ParamsWithKind,
  TezosToolkit,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { TransactionValues } from "../../components/sendForm/types";
import { makeContract, makeToolkitWithDummySigner } from "./helpers";

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
    }
  }

  return result;
};

export const transactionValuesToBatchParams = async (
  transactions: TransactionValues[],
  pk: string,
  network: TezosNetwork
): Promise<ParamsWithKind[]> => {
  if (!transactions.length) {
    return [];
  }

  const Tezos = makeToolkitWithDummySigner(
    pk,
    transactions[0].values.sender,
    network
  );

  return transactionValuesToParams(transactions, Tezos);
};
