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
  entrypoint: string,
  argTypes: MichelsonV1Expression,
  argValue: MichelsonV1Expression,
  amount = "0"
) => {
  return [
    ...LAMBDA_HEADER,
    {
      prim: "PUSH",
      args: [
        { prim: "address" },
        { string: operation.contract + "%" + entrypoint },
      ],
    },
    {
      prim: "CONTRACT",
      args: [argTypes],
    },
    // If contract is not valid then fail and rollback the whole transaction
    [{ prim: "IF_NONE", args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []] }],
    { prim: "PUSH", args: [{ prim: "mutez" }, { int: amount }] },
    { prim: "PUSH", args: [argTypes, argValue] },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const LAMBDA_HEADER: MichelsonV1Expression[] = [
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

export const makeLambda = async (
  operation: Operation,
  network: TezosNetwork
) => {
  const nodeUrl = nodeUrls[network];
  const toolkit = new TezosToolkit(nodeUrl);
  switch (operation.type) {
    case "tez":
      switch (addressType(operation.recipient)) {
        case "user":
          return MANAGER_LAMBDA.transferImplicit(
            operation.recipient,
            Number(operation.amount)
          );
        case "contract":
          return MANAGER_LAMBDA.transferToContract(
            operation.recipient,
            Number(operation.amount)
          );
      }
    // eslint-disable-next-line no-fallthrough
    case "fa1.2":
    case "fa2": {
      const method = await (operation.type === "fa2"
        ? makeFA2TransferMethod(operation, toolkit)
        : makeFA12TransferMethod(operation, toolkit));

      const parameter = method.toTransferParams().parameter;

      // how the entrypoint is specified in taquito?
      if (!parameter?.entrypoint || !parameter.value) {
        throw new Error("Missing parameter on a token transfer method");
      }

      return contractLambda(
        operation,
        "transfer",
        operation.type === "fa2"
          ? FA2_TRANSFER_ARG_TYPES
          : FA12_TRANSFER_ARG_TYPES,
        parameter.value
      );
    }
    case "delegation":
      if (operation.recipient) {
        return MANAGER_LAMBDA.setDelegate(operation.recipient);
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
  const opsLambdas = (
    await Promise.all(
      operations.map((operation) => makeLambda(operation, network))
    )
  ).flatMap(headlessLambda);

  return [...LAMBDA_HEADER, ...opsLambdas];
};
