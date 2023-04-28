import { TezosNetwork } from "@airgap/tezos";
import {
  OpKind,
  ParamsWithKind,
  TezosToolkit,
  WalletParamsWithKind,
} from "@taquito/taquito";
import { OperationValue } from "../../components/sendForm/types";
import { makeFA2TransferMethod, makeToolkitWithDummySigner } from "./helpers";

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
          amount: operation.value.amount,
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
          if (operation.data.type !== "nft") {
            throw new Error("Should be nft");
          }
          const Tezos = signer;
          const transferMethod = await makeFA2TransferMethod(
            {
              sender: operation.value.sender,
              amount: operation.value.amount,
              contract: operation.data.contract,
              recipient: operation.value.recipient,
              tokenId: operation.data.tokenId,
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
