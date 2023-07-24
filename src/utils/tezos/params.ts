import { OpKind, ParamsWithKind, WalletParamsWithKind } from "@taquito/taquito";
import { Account } from "../../types/Account";
import { Operation } from "../../types/Operation";
import { makeTokenTransferParams } from "./helpers";

export const operationsToWalletParams = async (
  operations: Operation[],
  sender: Account
): Promise<WalletParamsWithKind[]> =>
  operationsToParams(operations, sender) as Promise<WalletParamsWithKind[]>;

export const operationsToParams = async (
  operations: Operation[],
  sender: Account
): Promise<ParamsWithKind[]> => {
  const result: ParamsWithKind[] = [];

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
          source: sender.address.pkh,
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

export const operationsToBatchParams = async (
  operations: Operation[],
  sender: Account
): Promise<ParamsWithKind[]> => {
  if (!operations.length) {
    return [];
  }
  return operationsToParams(operations, sender);
};
