import { OpKind } from "@taquito/rpc";
import { type ParamsWithKind, type WalletParamsWithKind } from "@taquito/taquito";
import { isValidMichelson } from "@umami/tezos";
import { shuffle, zipWith } from "lodash";

import { type AccountOperations, type EstimatedAccountOperations } from "./AccountOperations";
import {
  type Operation,
  makeFA12TransactionParameter,
  makeFA2TransactionParameter,
  makeMultisigProposeOperation,
} from "./Operation";

export const selectRandomElements = <T>(
  arr: T[],
  n: number
): {
  index: number;
  value: T;
}[] =>
  shuffle(arr.map((value, index) => ({ value, index })))
    .slice(0, n)
    .sort((a, b) => a.index - b.index);

export const operationToTaquitoOperation = (operation: Operation): ParamsWithKind => {
  switch (operation.type) {
    case "tez":
      return {
        kind: OpKind.TRANSACTION,
        to: operation.recipient.pkh,
        amount: parseInt(operation.amount),
        mutez: true,
      };
    case "contract_call":
      return {
        kind: OpKind.TRANSACTION,
        to: operation.contract.pkh,
        amount: parseInt(operation.amount),
        mutez: true,
        parameter: { entrypoint: operation.entrypoint, value: operation.args },
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
        parameter: makeFA12TransactionParameter(operation),
      };
    case "fa2":
      return {
        kind: OpKind.TRANSACTION,
        amount: 0,
        to: operation.contract.pkh,
        parameter: makeFA2TransactionParameter(operation),
      };
    case "contract_origination": {
      // if storage is a valid Michelson we need to pass it in as init, not the storage
      if (isValidMichelson(operation.storage)) {
        return {
          kind: OpKind.ORIGINATION,
          code: operation.code,
          init: operation.storage,
        };
      }
      return {
        kind: OpKind.ORIGINATION,
        code: operation.code,
        storage: operation.storage,
      };
    }
    case "stake":
      return {
        kind: OpKind.TRANSACTION,
        amount: parseInt(operation.amount),
        source: operation.sender.pkh,
        to: operation.sender.pkh,
        parameter: { entrypoint: "stake", value: { prim: "Unit" } },
        mutez: true,
      };
    case "unstake":
      return {
        kind: OpKind.TRANSACTION,
        amount: parseInt(operation.amount),
        source: operation.sender.pkh,
        to: operation.sender.pkh,
        parameter: { entrypoint: "unstake", value: { prim: "Unit" } },
        mutez: true,
      };
    case "finalize_unstake":
      return {
        kind: OpKind.TRANSACTION,
        amount: 0,
        source: operation.sender.pkh,
        to: operation.sender.pkh,
        parameter: { entrypoint: "finalize_unstake", value: { prim: "Unit" } },
      };
  }
};

export const operationsToBatchParams = ({
  type: operationsType,
  operations: originalOperations,
  sender,
}: AccountOperations): ParamsWithKind[] => {
  const operations =
    operationsType === "implicit"
      ? originalOperations
      : [makeMultisigProposeOperation(sender.address, originalOperations)];

  return operations.map(operationToTaquitoOperation);
};

export const operationsToWalletParams = (operations: EstimatedAccountOperations) =>
  zipWith(operationsToBatchParams(operations), operations.estimates, (operation, estimate) => ({
    ...operation,
    ...estimate,
  })) as WalletParamsWithKind[];

// allows to kill a promise if it takes more than the specified timeout
export const withTimeout = <T>(fn: () => Promise<T>, timeout: number, errorMessage?: string) =>
  Promise.race([
    fn(),
    // it's safe to use the same type parameter T here
    // because we're going to throw anyway which stops the execution
    new Promise<T>((_, reject) =>
      setTimeout(() => {
        reject(new Error(errorMessage || "The operation has timed out"));
      }, timeout)
    ),
  ]);
