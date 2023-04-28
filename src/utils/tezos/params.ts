import { TezosNetwork } from "@airgap/tezos";
import {
  OpKind,
  ParamsWithKind,
  TezosToolkit,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { TransactionValues } from "../../components/sendForm/types";
import { makeFA2TransferMethod, makeToolkitWithDummySigner } from "./helpers";

export const transactionValuesToWalletParams = async (
  transactions: TransactionValues[],
  signer: TezosToolkit
): Promise<WalletParamsWithKind[]> =>
  transactionValuesToParams(transactions, signer) as Promise<
    WalletParamsWithKind[]
  >;

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
          const transferMethod = await makeFA2TransferMethod(
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
            ...transferMethod.toTransferParams(),
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
