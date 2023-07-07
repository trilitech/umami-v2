import { ContractAddress, ImplicitAddress, parseContractPkh, parsePkh } from "../../types/Address";
import { Asset, FA12Token, FA2Token, NFT } from "../../types/Asset";

import * as RawOperations from "../../types/RawOperation";

type TezMode = { type: "tez" };

type TokenMode = {
  type: "token";
  data: Asset;
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

type FA12OperationWithAsset = RawOperations.FA12Operation & { data: FA12Token };
type FA2OperationWithAsset = RawOperations.FA2Operation & { data: FA2Token | NFT };

export type OperationValue =
  | RawOperations.TezOperation
  | FA12OperationWithAsset
  | FA2OperationWithAsset
  | RawOperations.Delegation;

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
  a: Asset,
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
