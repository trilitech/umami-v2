import { MichelsonV1Expression } from "@taquito/rpc";
import { TransferParams } from "@taquito/taquito";
import { Address, ContractAddress, ImplicitAddress } from "./Address";
import { ApproveOrExecute } from "../utils/tezos/types";

export type TezTransfer = {
  type: "tez";
  recipient: Address;
  amount: string; // TODO: enforce mutez format here
  parameter?: TransferParams["parameter"]; //TODO: remove this
};

export type FA2Transfer = {
  type: "fa2";
  sender: Address;
  recipient: Address;
  contract: ContractAddress;
  tokenId: string;
  amount: string;
};

export type FA12Transfer = Omit<FA2Transfer, "type" | "tokenId"> & {
  type: "fa1.2";
  tokenId: "0";
};

export type Delegation = {
  type: "delegation";
  sender: Address;
  recipient: ImplicitAddress;
};

export type Undelegation = {
  type: "undelegation";
  sender: Address;
};

export type ContractOrigination = {
  type: "contract_origination";
  sender: Address;
  code: MichelsonV1Expression[];
  storage: any;
};

export type ContractCall = {
  type: "contract_call";
  contract: ContractAddress;
  amount: string;
  entrypoint: string;
  arguments: MichelsonV1Expression;
};

export type Operation =
  | TezTransfer
  | FA12Transfer
  | FA2Transfer
  | Delegation
  | Undelegation
  | ContractOrigination
  | ContractCall;

export const makeMultisigApproveOrExecuteOperation = (
  contract: ContractAddress,
  entrypoint: ApproveOrExecute,
  operationId: string
): ContractCall =>
  makeContractCallOperation(contract, entrypoint, {
    int: operationId,
  });

export const makeContractCallOperation = (
  contract: ContractAddress,
  entrypoint: string,
  args: MichelsonV1Expression,
  amount = "0" // Most of the time, we don't need to send any tez on contract calls
): ContractCall => {
  return {
    type: "contract_call",
    contract,
    entrypoint,
    arguments: args,
    amount,
  };
};
