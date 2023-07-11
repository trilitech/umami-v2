import { TezosNetwork } from "@airgap/tezos";
import {
  OpKind,
  ParamsWithKind,
  TezosToolkit,
  TransferParams,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { FA12Operation, FA2Operation, RawOperation } from "../../types/RawOperation";
import {
  makeFA12TransferMethod,
  makeFA2TransferMethod,
  makeToolkitWithDummySigner,
} from "./helpers";

export const operationsToWalletParams = async (
  operations: RawOperation[],
  signer: TezosToolkit
): Promise<WalletParamsWithKind[]> =>
  operationsToParams(operations, signer) as Promise<WalletParamsWithKind[]>;

export const operationsToParams = async (
  operations: RawOperation[],
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
        {
          const transferParams = await makeTokenTransferParams(operation, toolkit);

          result.push({
            kind: OpKind.TRANSACTION,
            ...transferParams,
          });
        }
        break;
    }
  }

  return result;
};

const makeTokenTransferParams = async (
  operation: FA12Operation | FA2Operation,
  tezosToolkit: TezosToolkit
): Promise<TransferParams> => {
  const transferMethod =
    operation.type === "fa1.2"
      ? makeFA12TransferMethod(operation, tezosToolkit)
      : makeFA2TransferMethod(operation, tezosToolkit);

  return (await transferMethod).toTransferParams();
};

export const operationsToBatchParams = async (
  operations: RawOperation[],
  pk: string,
  pkh: string,
  network: TezosNetwork
): Promise<ParamsWithKind[]> => {
  if (!operations.length) {
    return [];
  }

  const Tezos = makeToolkitWithDummySigner(pk, pkh, network);

  return operationsToParams(operations, Tezos);
};
