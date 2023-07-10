import { ContractAddress, ImplicitAddress, parseContractPkh, parsePkh } from "../../types/Address";
import { TokenBalance, FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../types/TokenBalance";
import { Delegation, FA12Operation, FA2Operation, TezOperation } from "../../types/RawOperation";

type TezMode = { type: "tez" };

type TokenMode = {
  type: "token";
  data: TokenBalance;
};

export type DelegationMode = {
  type: "delegation";
  data?: {
    undelegate: boolean;
  };
};

type BatchMode = {
  type: "batch";
  data: {
    batch: OperationValue[];
    signer: string;
  };
};

export type SendFormMode = TezMode | TokenMode | DelegationMode | BatchMode;

export type FA12OperationWithAsset = FA12Operation & { data: FA12TokenBalance };
export type FA2OperationWithAsset = FA2Operation & { data: FA2TokenBalance | NFTBalance };

export type OperationValue =
  | TezOperation
  | FA12OperationWithAsset
  | FA2OperationWithAsset
  | Delegation;

export type ProposalOperations = {
  type: "proposal";
  content: OperationValue[];
  sender: ContractAddress;
  signer: ImplicitAddress;
};

export type ImplicitOperations = {
  type: "implicit";
  content: OperationValue[];
  signer: ImplicitAddress;
};

export type FormOperations = ProposalOperations | ImplicitOperations;

export type EstimatedOperation = {
  operations: FormOperations;
  fee: string;
};

export const classifyAsset = (
  a: TokenBalance,
  value: { amount: string; sender: string; recipient: string }
): FA12OperationWithAsset | FA2OperationWithAsset => {
  if (a.type === "fa1.2") {
    return {
      type: "fa1.2",
      data: a,
      amount: value.amount,
      sender: parsePkh(value.sender),
      recipient: parsePkh(value.recipient),
      contract: parseContractPkh(a.contract),
    };
  }
  return {
    type: "fa2",
    data: a,
    amount: value.amount,
    sender: parsePkh(value.sender),
    recipient: parsePkh(value.recipient),
    tokenId: a.tokenId,
    contract: parseContractPkh(a.contract),
  };
};
