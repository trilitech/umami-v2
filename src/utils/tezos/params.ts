import { TezosNetwork } from "@airgap/tezos";
import { OpKind, ParamsWithKind, TezosToolkit, WalletParamsWithKind } from "@taquito/taquito";
import { OperationValue } from "../../components/sendForm/types";
import { makeTokenTransferParams, makeToolkitWithDummySigner } from "./helpers";

export const operationValuesToWalletParams = async (
  operations: OperationValue[],
  signer: TezosToolkit
): Promise<WalletParamsWithKind[]> =>
  operationValuesToParams(operations, signer) as Promise<WalletParamsWithKind[]>;

export const operationValuesToParams = async (
  operations: OperationValue[],
  toolkit: TezosToolkit
): Promise<ParamsWithKind[]> => {
  const result: ParamsWithKind[] = [];
  const signerPkh = await toolkit.signer.publicKeyHash();

  for (const operation of operations) {
    switch (operation.type) {
      case "tez":
        result.push({
          kind: OpKind.TRANSACTION,
          to: operation.recipient.pkh,
          amount: parseInt(operation.amount),
          parameter: operation.parameter,
          mutez: true,
        });
        break;
      case "delegation":
        result.push({
          kind: OpKind.DELEGATION,
          source: signerPkh,
          delegate: operation.recipient?.pkh,
        });
        break;
      case "fa1.2":
      case "fa2":
        result.push({
          kind: OpKind.TRANSACTION,
          ...makeTokenTransferParams(operation),
        });
        break;
    }
  }

  return result;
};

export const operationValuesToBatchParams = async (
  operations: OperationValue[],
  pk: string,
  pkh: string,
  network: TezosNetwork
): Promise<ParamsWithKind[]> => {
  if (!operations.length) {
    return [];
  }

  const Tezos = makeToolkitWithDummySigner(pk, pkh, network);

  return operationValuesToParams(operations, Tezos);
};
