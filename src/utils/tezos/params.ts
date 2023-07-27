import { OpKind, ParamsWithKind, WalletParamsWithKind } from "@taquito/taquito";
import { Operation } from "../../types/Operation";
import { makeTokenTransferParams } from "./helpers";

export const operationsToBatchParams = (operations: Operation[]): ParamsWithKind[] =>
  // eslint-disable-next-line array-callback-return
  operations.map(operation => {
    switch (operation.type) {
      case "tez":
        return {
          kind: OpKind.TRANSACTION,
          to: operation.recipient.pkh,
          amount: parseInt(operation.amount),
          parameter: operation.parameter,
          mutez: true,
        };
      case "delegation":
        return {
          kind: OpKind.DELEGATION,
          source: operation.sender.pkh,
          delegate: operation.recipient?.pkh,
        };
      case "fa1.2":
      case "fa2":
        return {
          kind: OpKind.TRANSACTION,
          ...makeTokenTransferParams(operation),
        };
    }
  });

export const operationsToWalletParams = operationsToBatchParams as (
  operations: Operation[]
) => WalletParamsWithKind[];
