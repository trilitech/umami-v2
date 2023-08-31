import { OpKind, ParamsWithKind, WalletParamsWithKind } from "@taquito/taquito";
import { Operation } from "../../types/Operation";
import { makeTokenTransferParams } from "./helpers";

export const operationsToBatchParams = (operations: Operation[]): ParamsWithKind[] =>
  // eslint-disable-next-line array-callback-return
  operations.map(operation => {
    switch (operation.type) {
      case "tez":
      case "contract_call": {
        const to = operation.type === "tez" ? operation.recipient.pkh : operation.contract.pkh;
        const parameter =
          operation.type === "tez"
            ? operation.parameter // TODO: set it to undefined after beacon uses contract_call
            : { entrypoint: operation.entrypoint, value: operation.arguments };
        return {
          kind: OpKind.TRANSACTION,
          to,
          amount: parseInt(operation.amount),
          mutez: true,
          parameter,
        };
      }
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
      case "fa2":
        return {
          kind: OpKind.TRANSACTION,
          ...makeTokenTransferParams(operation),
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
