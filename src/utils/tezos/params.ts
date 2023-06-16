import { TezosNetwork } from "@airgap/tezos";
import {
  OpKind,
  ParamsWithKind,
  TezosToolkit,
  TransferParams,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { BatchOperation, OperationValue } from "../../components/sendForm/types";
import {
  makeFA12TransferMethod,
  makeFA2TransferMethod,
  makeToolkitWithDummySigner,
} from "./helpers";

export const operationValuesToWalletParams = async (
  operations: BatchOperation[],
  signer: TezosToolkit
): Promise<WalletParamsWithKind[]> =>
  operationValuesToParams(operations, signer) as Promise<WalletParamsWithKind[]>;

export const operationValuesToParams = async (
  operations: BatchOperation[],
  signer: TezosToolkit
): Promise<ParamsWithKind[]> => {
  const result: ParamsWithKind[] = [];

  for (const operation of operations) {
    switch (operation.type) {
      case "tez":
        {
          result.push({
            kind: OpKind.TRANSACTION,
            to: operation.recipient,
            amount: parseInt(operation.amount),
            parameter: operation.parameter,
            mutez: true,
          });
        }
        break;
      case "delegation":
        result.push({
          kind: OpKind.DELEGATION,
          source: operation.sender,
          delegate: operation.recipient,
        });
        break;
      case "fa1.2": {
        const bar = operation.sender;
        throw new Error("bar");
        // const transferParams = await makeTokenTransferParams(operation, signer);
        // result.push({
        //   kind: OpKind.TRANSACTION,
        //   ...transferParams,
        // });
      }
      case "fa2":
        {
          const bar = operation.sender;
          throw new Error("cool");
        }
        // {
        //   const transferParams = await makeTokenTransferParams(operation, signer);

        //   result.push({
        //     kind: OpKind.TRANSACTION,
        //     ...transferParams,
        //   });
        // }
        break;
    }
  }

  return result;
};

const makeTokenTransferParams = async (
  operation: OperationValue,
  signer: TezosToolkit
): Promise<TransferParams> => {
  if (operation.type !== "token") {
    throw new Error("Incorrect type");
  }
  const asset = operation.data;
  const { contract } = asset;
  const args = { ...operation.value, contract };
  const transferMethod =
    asset.type === "fa1.2"
      ? makeFA12TransferMethod(args, signer)
      : makeFA2TransferMethod({ ...args, tokenId: asset.tokenId }, signer);

  return (await transferMethod).toTransferParams();
};

export const operationValuesToBatchParams = async (
  operations: BatchOperation[],
  pk: string,
  network: TezosNetwork
): Promise<ParamsWithKind[]> => {
  if (!operations.length) {
    return [];
  }

  const Tezos = makeToolkitWithDummySigner(pk, operations[0].sender, network);

  return operationValuesToParams(operations, Tezos);
};
