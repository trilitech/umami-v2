import { TezosNetwork } from "@airgap/tezos";
import {
  OpKind,
  ParamsWithKind,
  TezosToolkit,
  TransferParams,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { OperationValue } from "../../components/sendForm/types";
import { parseContractPkh } from "../../types/Address";
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
  const signerPkh = await signer.signer.publicKeyHash();

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
  if (operation.type !== "fa1.2" && operation.type !== "fa2") {
    throw new Error("Incorrect type");
  }
  const asset = operation.data;
  const { contract } = asset;
  const args = {
    sender: operation.sender,
    recipient: operation.recipient,
    amount: operation.amount,
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
  pkh: string,
  network: TezosNetwork
): Promise<ParamsWithKind[]> => {
  if (!operations.length) {
    return [];
  }

  const Tezos = makeToolkitWithDummySigner(pk, pkh, network);

  return operationValuesToParams(operations, Tezos);
};
