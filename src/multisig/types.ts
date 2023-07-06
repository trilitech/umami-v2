import { BigMapAbstraction, TransferParams } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { Address, ImplicitAddress } from "../types/Address";

import { FA12TransferMethodArgs, FA2TransferMethodArgs } from "../utils/tezos/types";

export type MultisigStorage = {
  last_op_id: BigNumber;
  pending_ops: BigMapAbstraction;
  threshold: BigNumber;
  owner: Address;
  metadata: BigMapAbstraction;
  signers: Address[];
};

export type TezOperation = {
  type: "tez";
  recipient: Address;
  amount: string;
  parameter?: TransferParams["parameter"];
};
export type FA12Operation = {
  type: "fa1.2";
} & FA12TransferMethodArgs;

export type FA2Operation = {
  type: "fa2";
} & FA2TransferMethodArgs;

export type Delegation = {
  type: "delegation";
  recipient: ImplicitAddress | undefined;
};

export type RawOperation = TezOperation | FA12Operation | FA2Operation | Delegation;
