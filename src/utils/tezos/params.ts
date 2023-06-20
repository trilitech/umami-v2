import { TezosNetwork } from "@airgap/tezos";
import {
  OpKind,
  ParamsWithKind,
  TezosToolkit,
  TransferParams,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { OperationValue } from "../../components/sendForm/types";
import { parseContractPkh, parsePkh } from "../../types/Address";
import {
  makeFA12TransferMethod,
  makeFA2TransferMethod,
  makeToolkitWithDummySigner,
} from "./helpers";

export const operationValuesToWalletParams = async (
  operations: OperationValue[],
  signer: TezosToolkit
): Promise<WalletParamsWithKind[]> =>
  operationValuesToParams(operations, signer) as Promise<WalletParamsWithKind[]>;

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
          amount: parseInt(operation.value.amount),
          parameter: operation.value.parameter,
          mutez: true,
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
          const transferParams = await makeTokenTransferParams(operation, signer);

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
  const asset = operation.data;
  const { contract } = asset;
  const args = {
    sender: parsePkh(operation.value.sender),
    recipient: parsePkh(operation.value.recipient),
    amount: operation.value.amount,
    contract: parseContractPkh(contract),
  };
  const transferMethod =
    asset.type === "fa1.2"
      ? makeFA12TransferMethod(args, signer)
      : makeFA2TransferMethod({ ...args, tokenId: asset.tokenId }, signer);

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

  const Tezos = makeToolkitWithDummySigner(pk, operations[0].value.sender, network);

  return operationValuesToParams(operations, Tezos);
};
