import { MichelsonV1Expression } from "@taquito/rpc";
import { TransferParams } from "@taquito/taquito";
import { Address, ContractAddress, ImplicitAddress } from "./Address";

export type TezTransfer = {
  type: "tez";
  recipient: Address;
  amount: string; // TODO: enforce mutez format here
  parameter?: TransferParams["parameter"];
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

export type Operation =
  | TezTransfer
  | FA12Transfer
  | FA2Transfer
  | Delegation
  | Undelegation
  | ContractOrigination;
