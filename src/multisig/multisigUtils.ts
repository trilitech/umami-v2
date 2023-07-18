import { MANAGER_LAMBDA } from "@taquito/taquito";
import { makeFA12TransactionParameter, makeFA2TransactionParameter } from "../utils/tezos";
import { FA12Operation, FA2Operation, Operation } from "../types/Operation";
import type { MichelsonV1Expression, TransactionOperationParameter } from "@taquito/rpc";
import { isEqual } from "lodash";

export const FA2_TRANSFER_ARG_TYPES = {
  args: [
    {
      args: [
        {
          annots: ["%from_"],
          prim: "address",
        },
        {
          annots: ["%txs"],
          args: [
            {
              args: [
                {
                  annots: ["%to_"],
                  prim: "address",
                },
                {
                  args: [
                    {
                      annots: ["%token_id"],
                      prim: "nat",
                    },
                    {
                      annots: ["%amount"],
                      prim: "nat",
                    },
                  ],
                  prim: "pair",
                },
              ],
              prim: "pair",
            },
          ],
          prim: "list",
        },
      ],
      prim: "pair",
    },
  ],
  prim: "list",
};

export const FA12_TRANSFER_ARG_TYPES = {
  args: [
    {
      annots: [":from"],
      prim: "address",
    },
    {
      args: [
        {
          annots: [":to"],
          prim: "address",
        },
        {
          annots: [":value"],
          prim: "nat",
        },
      ],
      prim: "pair",
    },
  ],
  prim: "pair",
};

const contractLambda = (
  operation: FA12Operation | FA2Operation,
  argTypes: MichelsonV1Expression,
  transactionParameter: TransactionOperationParameter
) => {
  return [
    ...LAMBDA_HEADER,
    {
      prim: "PUSH",
      args: [
        { prim: "address" },
        { string: operation.contract.pkh + "%" + transactionParameter.entrypoint },
      ],
    },
    {
      prim: "CONTRACT",
      args: [argTypes],
    },
    // If contract is not valid then fail and rollback the whole transaction
    [{ prim: "IF_NONE", args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []] }],
    { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
    { prim: "PUSH", args: [argTypes, transactionParameter.value] },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const LAMBDA_HEADER: MichelsonV1Expression[] = [
  { prim: "DROP" },
  { prim: "NIL", args: [{ prim: "operation" }] },
];

const headlessLambda = (lambda: MichelsonV1Expression[]): MichelsonV1Expression[] => {
  if (isEqual(lambda.slice(0, 2), LAMBDA_HEADER)) {
    return lambda.slice(2);
  }
  return lambda;
};

export const makeLambda = (operation: Operation): MichelsonV1Expression[] => {
  switch (operation.type) {
    case "tez":
      switch (operation.recipient.type) {
        case "implicit":
          return MANAGER_LAMBDA.transferImplicit(operation.recipient.pkh, Number(operation.amount));
        case "contract":
          return MANAGER_LAMBDA.transferToContract(
            operation.recipient.pkh,
            Number(operation.amount)
          );
      }
    // eslint-disable-next-line no-fallthrough
    case "fa1.2":
      return contractLambda(
        operation,
        FA12_TRANSFER_ARG_TYPES,
        makeFA12TransactionParameter(operation)
      );
    case "fa2": {
      return contractLambda(
        operation,
        FA2_TRANSFER_ARG_TYPES,
        makeFA2TransactionParameter(operation)
      );
    }
    case "delegation":
      if (operation.recipient) {
        return MANAGER_LAMBDA.setDelegate(operation.recipient.pkh);
      }
      return MANAGER_LAMBDA.removeDelegate();
  }
};

/**
 *
 * @param operations List of JSON operations
 * @param network Network is needed for fetching contract parameter elements in lambda
 * @returns Lambda in MichelsonJSON (=Micheline) format
 */
export const makeBatchLambda = (operations: Operation[]) => {
  const opsLambdas = operations.map(operation => makeLambda(operation)).flatMap(headlessLambda);

  return [...LAMBDA_HEADER, ...opsLambdas];
};
