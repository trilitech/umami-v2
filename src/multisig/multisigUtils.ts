import { TezosNetwork } from "@airgap/tezos";
import { TezosToolkit } from "@taquito/taquito";
import { makeFA12TransferMethod, makeFA2TransferMethod } from "../utils/tezos";
import { nodeUrls } from "../utils/tezos/consts";
import { OperationBase } from "./types";
import { lambdaOfOperation as lambdaOfOperationRaw } from "./vendors/beacon-lambda-transformer/src";
import { RpcClient } from "./vendors/beacon-lambda-transformer/src/service/rpc";
import {
  MichelsonJSON,
  Transaction,
} from "./vendors/beacon-lambda-transformer/src/typings";

/**
 * To handle non tez transactions we rely on the following vendored and modified code (some exports added and some code commented out)
 *  https://github.com/airgap-it/beacon-sdk/pull/497
 */
const lambdaOfNonTezTransaction = (trans: Transaction, nodeUrl: string) =>
  lambdaOfOperationRaw(new RpcClient(nodeUrl))(trans);

const lambdaOfTezTransaction = (
  key: string,
  mutez: string
): MichelsonJSON[] => {
  // Copied from taquito's LAMBDA_MANAGER.
  // We don't include the head since content is destined to be appeneded to a batch
  return [
    // Ingore head
    // { prim: "DROP" },
    // { prim: "NIL", args: [{ prim: "operation" }] },
    {
      prim: "PUSH",
      args: [{ prim: "key_hash" }, { string: key }],
    },
    { prim: "IMPLICIT_ACCOUNT" },
    {
      prim: "PUSH",
      args: [{ prim: "mutez" }, { int: `${mutez}` }],
    },
    { prim: "UNIT" },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const wrapInBatch = (ops: MichelsonJSON[]) => {
  // Add head and append operations
  return [
    // Drop lambda argument
    {
      prim: "DROP",
    },
    // Create empty list
    {
      prim: "NIL",
      args: [{ prim: "operation" }],
    },
    ...ops,
  ];
};

/**
 *  nodeUrl is required for:
 * - instantiating toolkit for contract
 * - fetching lambda params for token transfers
 */
const makeLambdaSingle = async (op: OperationBase, nodeUrl: string) => {
  const toolkit = new TezosToolkit(nodeUrl);
  switch (op.type) {
    case "tez":
      return lambdaOfTezTransaction(op.recipient, op.amount);
    case "fa1.2": {
      const { type, ...args } = op;
      const method = await makeFA12TransferMethod(args, toolkit);

      const parameter = method.toTransferParams().parameter;

      if (!parameter?.entrypoint || !parameter.value) {
        throw new Error("Missing parameter on FA1.2 transfer method");
      }

      return lambdaOfNonTezTransaction(
        {
          amount: op.amount,
          destination: op.contract,
          kind: "transaction",
          parameters: {
            entrypoint: parameter.entrypoint,
            value: parameter.value as MichelsonJSON,
          },
        },
        nodeUrl
      );
    }
    case "fa2": {
      const { type, ...args } = op;
      const method = await makeFA2TransferMethod(args, toolkit);

      const parameter = method.toTransferParams().parameter;

      if (!parameter?.entrypoint || !parameter.value) {
        throw new Error("Missing parameter on FA1.2 transfer method");
      }

      return lambdaOfNonTezTransaction(
        {
          amount: op.amount,
          destination: op.contract,
          kind: "transaction",
          parameters: {
            entrypoint: parameter.entrypoint,
            value: parameter.value as MichelsonJSON,
          },
        },
        nodeUrl
      );
    }
    default: {
      throw new Error("Unsupported operation", op);
    }
  }
};

/**
 *
 * @param ops List of JSON operations
 * @param network Network is needed for fetching contract parameter elements in lambda
 * @returns Lambda in MichelsonJSON (=Micheline) format
 */
export const makeLamba = async (
  ops: OperationBase[],
  network: TezosNetwork
) => {
  const nodeUrl = nodeUrls[network];
  const opsLambabdas = (
    await Promise.all(ops.map((o) => makeLambdaSingle(o, nodeUrl)))
  ).flat();

  return wrapInBatch(opsLambabdas);
};
