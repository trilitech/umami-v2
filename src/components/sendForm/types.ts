import { Account, AccountType, ImplicitAccount, MultisigAccount } from "../../types/Account";
import { parseContractPkh, parsePkh } from "../../types/Address";
import { FA12Operation, FA2Operation, Operation } from "../../types/Operation";
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
  data: FormOperations;
};

export type SendFormMode = TezMode | TokenMode | DelegationMode | BatchMode;

export type ProposalOperations = {
  type: "proposal";
  content: Operation[];
  sender: MultisigAccount;
  signer: ImplicitAccount;
};

export type ImplicitOperations = {
  type: "implicit";
  content: Operation[];
  sender: ImplicitAccount;
  signer: ImplicitAccount; // must be the same as sender
};

// TODO: come up with a better name
export type FormOperations = ProposalOperations | ImplicitOperations;

export const makeFormOperations = (
  sender: Account,
  signer: ImplicitAccount,
  operations: Operation[]
): FormOperations => {
  switch (sender.type) {
    case AccountType.LEDGER:
    case AccountType.MNEMONIC:
    case AccountType.SOCIAL:
      if (sender.address.pkh !== signer.address.pkh) {
        throw new Error("Sender and Signer must be the same");
      }
      return {
        type: "implicit",
        content: operations,
        signer: sender,
        sender,
      };

    case AccountType.MULTISIG:
      return {
        type: "proposal",
        content: operations,
        sender,
        signer,
      };
  }
};

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
