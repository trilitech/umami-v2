import { BigMapAbstraction } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";

import {
  FA12TransferMethodArgs,
  FA2TransferMethodArgs,
} from "../utils/tezos/types";

export type MultisigStorage = {
  last_op_id: BigNumber;
  pending_ops: BigMapAbstraction;
};

export type TezOperationBase = {
  type: "tez";
  recipient: string;
  amount: string;
};
export type FA12OperationBase = {
  type: "fa1.2";
} & FA12TransferMethodArgs;

export type FA2OperationBase = {
  type: "fa2";
} & FA2TransferMethodArgs;

export type OperationBase =
  | TezOperationBase
  | FA12OperationBase
  | FA2OperationBase;
