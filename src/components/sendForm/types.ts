import { ContractAddress, ImplicitAddress, parseContractPkh, parsePkh } from "../../types/Address";
import { FA12Operation, FA2Operation, RawOperation } from "../../types/RawOperation";
import { Token } from "../../types/Token";

type TezMode = { type: "tez" };

type TokenMode = {
  type: "token";
  data: Token;
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
    batch: RawOperation[];
    signer: string;
  };
};

export type SendFormMode = TezMode | TokenMode | DelegationMode | BatchMode;

export type ProposalOperations = {
  type: "proposal";
  content: RawOperation[];
  sender: ContractAddress;
  signer: ImplicitAddress;
};

export type ImplicitOperations = {
  type: "implicit";
  content: RawOperation[];
  signer: ImplicitAddress;
};

export type FormOperations = ProposalOperations | ImplicitOperations;

export type EstimatedOperation = {
  operations: FormOperations;
  fee: string;
};

export const toOperation = (
  token: Token,
  value: { amount: string; sender: string; recipient: string }
): FA12Operation | FA2Operation => {
  switch (token.type) {
    case "fa1.2":
      return {
        type: "fa1.2",
        amount: value.amount,
        sender: parsePkh(value.sender),
        recipient: parsePkh(value.recipient),
        contract: parseContractPkh(token.contract),
        tokenId: "0",
      };

    case "fa2":
    case "nft":
      return {
        type: "fa2",
        amount: value.amount,
        sender: parsePkh(value.sender),
        recipient: parsePkh(value.recipient),
        contract: parseContractPkh(token.contract),
        tokenId: token.tokenId,
      };
  }
};
