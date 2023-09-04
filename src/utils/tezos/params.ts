import { OpKind, ParamsWithKind, WalletParamsWithKind } from "@taquito/taquito";
import { Operation } from "../../types/Operation";
import { makeFA12TransactionParameter, makeFA2TransactionParameter } from "./helpers";

export const operationsToBatchParams = (operations: Operation[]): ParamsWithKind[] =>
  // eslint-disable-next-line array-callback-return
  operations.map(operation => {
    switch (operation.type) {
      case "tez":
        return {
          kind: OpKind.TRANSACTION,
          to: operation.recipient.pkh,
          amount: parseInt(operation.amount),
          mutez: true,
          parameter: operation.parameter, // TODO: set it to undefined after beacon uses contract_call,
        };
      case "contract_call":
        return {
          kind: OpKind.TRANSACTION,
          to: operation.contract.pkh,
          amount: parseInt(operation.amount),
          mutez: true,
          parameter: { entrypoint: operation.entrypoint, value: operation.arguments },
        };

      case "delegation":
        return {
          kind: OpKind.DELEGATION,
          source: operation.sender.pkh,
          delegate: operation.recipient.pkh,
        };
      case "undelegation":
        return {
          kind: OpKind.DELEGATION,
          source: operation.sender.pkh,
          delegate: undefined,
        };
      case "fa1.2":
        return {
          kind: OpKind.TRANSACTION,
          amount: 0,
          to: operation.contract.pkh,
          ...makeFA12TransactionParameter(operation),
        };
      case "fa2":
        return {
          kind: OpKind.TRANSACTION,
          amount: 0,
          to: operation.contract.pkh,
          ...makeFA2TransactionParameter(operation),
        };
      case "contract_origination": {
        return {
          kind: OpKind.ORIGINATION,
          ...operation,
        };
      }
    }
  });

export const operationsToWalletParams = operationsToBatchParams as (
  operations: Operation[]
) => WalletParamsWithKind[];
