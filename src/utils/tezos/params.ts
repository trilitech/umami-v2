import { TezosNetwork } from "@airgap/tezos";
import {
  OpKind,
  ParamsWithKind,
  TezosToolkit,
  TransferParams,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { OperationValue } from "../../components/sendForm/types";
import {
  makeFA12TransferMethod,
  makeFA2TransferMethod,
  makeToolkitWithDummySigner,
} from "./helpers";

export const operationValuesToWalletParams = async (
  operations: OperationValue[],
  signer: TezosToolkit
): Promise<WalletParamsWithKind[]> =>
  operationValuesToParams(operations, signer) as Promise<
    WalletParamsWithKind[]
  >;

export const operationValuesToParams = async (
  operations: OperationValue[],
  signer: TezosToolkit
): Promise<ParamsWithKind[]> => {
  const result: ParamsWithKind[] = [];

  for (const operation of operations) {
    switch (operation.type) {
      case "tez":
        result.push({
          kind: OpKind.TRANSACTION,
          to: operation.value.recipient,
          amount: operation.value.amount.toNumber(),
          parameter: operation.value.parameter,
        });
        break;
      case "delegation":
        result.push({
          kind: OpKind.DELEGATION,
          source: operation.value.sender,
          delegate: operation.value.recipient,
        });
        break;
      case "token":
        {
          const transferParams = await makeTokenTransferParams(
            operation,
            signer
          );

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
  operation: OperationValue,
  signer: TezosToolkit
): Promise<TransferParams> => {
  if (operation.type !== "token") {
    throw new Error("Incorrect type");
  }
  const { type: tokenType, contract } = operation.data;
  const args = { ...operation.value, contract };

  const transferMethod =
    tokenType === "fa1.2"
      ? makeFA12TransferMethod(args, signer)
      : makeFA2TransferMethod(
          { ...args, tokenId: operation.data.tokenId },
          signer
        );

  return (await transferMethod).toTransferParams();
};

export const operationValuesToBatchParams = async (
  operations: OperationValue[],
  pk: string,
  network: TezosNetwork
): Promise<ParamsWithKind[]> => {
  if (!operations.length) {
    return [];
  }

  const Tezos = makeToolkitWithDummySigner(
    pk,
    operations[0].value.sender,
    network
  );

  return operationValuesToParams(operations, Tezos);
};
