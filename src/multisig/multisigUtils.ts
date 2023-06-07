import { TezosNetwork } from "@airgap/tezos";
import { TezosToolkit, MANAGER_LAMBDA } from "@taquito/taquito";
import { makeFA12TransferMethod, makeFA2TransferMethod } from "../utils/tezos";
import { nodeUrls } from "../utils/tezos/consts";
import { FA12Operation, FA2Operation, Operation } from "./types";
import { MichelsonV1Expression } from "@taquito/rpc";
import { isEqual } from "lodash";
import { addressType } from "../types/Address";

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
  argValue: MichelsonV1Expression
) => {
  const argTypes =
    operation.type === "fa1.2"
      ? FA12_TRANSFER_ARG_TYPES
      : FA2_TRANSFER_ARG_TYPES;
  return [
    {
      prim: "PUSH",
      args: [
        { prim: "address" },
        // both FA1.2 and FA2 must implement the transfer entrypoint
        // https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md#approvable-ledger-interface
        // https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md#interface-specification
        { string: operation.contract + "%transfer" },
      ],
    },
    {
      prim: "CONTRACT",
      args: [argTypes],
    },
    {
      prim: "IF_NONE",
      args: [
        // If contract is not valid then fail and rollback the whole transaction
        [{ prim: "UNIT" }, { prim: "FAILWITH" }],
        [
          // TODO: check if this is needed, exists in V1 implementation and is always 0
          { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
          { prim: "PUSH", args: [argTypes, argValue] },
          { prim: "TRANSFER_TOKENS" },
          { prim: "CONS" },
        ],
      ],
    },
  ];
};

const LAMBDA_HEADER = [
  { prim: "DROP" },
  { prim: "NIL", args: [{ prim: "operation" }] },
];

const headlessLambda = (
  lambda: MichelsonV1Expression[]
): MichelsonV1Expression[] => {
  if (isEqual(lambda.slice(0, 2), LAMBDA_HEADER)) {
    return lambda.slice(2);
  }
  return lambda;
};

const wrapInBatch = (ops: MichelsonV1Expression[]) => {
  // Add head and append operations
  return [...LAMBDA_HEADER, ...ops];
};

const makeLambda = async (op: Operation, nodeUrl: string) => {
  const toolkit = new TezosToolkit(nodeUrl);
  switch (op.type) {
    case "tez":
      switch (addressType(op.recipient)) {
        case "user":
          return MANAGER_LAMBDA.transferImplicit(
            op.recipient,
            Number(op.amount)
          );
        case "contract":
          return MANAGER_LAMBDA.transferToContract(
            op.recipient,
            Number(op.amount)
          );
      }
    // eslint-disable-next-line no-fallthrough
    case "fa1.2":
    case "fa2": {
      const method = await (op.type === "fa2"
        ? makeFA2TransferMethod(op, toolkit)
        : makeFA12TransferMethod(op, toolkit));

      const parameter = method.toTransferParams().parameter;

      // how the entrypoint is specified in taquito?
      if (!parameter?.entrypoint || !parameter.value) {
        throw new Error("Missing parameter on a token transfer method");
      }

      return contractLambda(op, parameter.value);
    }
    case "delegation":
      if (op.recipient) {
        return MANAGER_LAMBDA.setDelegate(op.recipient);
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
export const makeBatchLambda = async (
  operations: Operation[],
  network: TezosNetwork
) => {
  const nodeUrl = nodeUrls[network];
  const opsLambdas = (
    await Promise.all(operations.map(op => makeLambda(op, nodeUrl)))
  ).flatMap(headlessLambda);

  return wrapInBatch(opsLambdas);
};
