import { Account, AccountType, ImplicitAccount, MultisigAccount } from "../../types/Account";
import { parseContractPkh, parsePkh } from "../../types/Address";
import { FA12Transfer, FA2Transfer, Operation } from "../../types/Operation";
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
  data: AccountOperations;
};

export type SendFormMode = TezMode | TokenMode | DelegationMode | BatchMode;

export type ProposalOperations = {
  type: "proposal";
  operations: Operation[];
  sender: MultisigAccount;
  signer: ImplicitAccount;
};

export type ImplicitOperations = {
  type: "implicit";
  operations: Operation[];
  sender: ImplicitAccount;
  signer: ImplicitAccount; // must be the same as sender
};

export type AccountOperations = ProposalOperations | ImplicitOperations;

export const makeAccountOperations = (
  sender: Account,
  signer: ImplicitAccount,
  operations: Operation[]
): AccountOperations => {
  switch (sender.type) {
    case AccountType.LEDGER:
    case AccountType.MNEMONIC:
    case AccountType.SOCIAL:
      if (sender.address.pkh !== signer.address.pkh) {
        throw new Error("Sender and Signer must be the same");
      }
      return {
        type: "implicit",
        operations,
        signer: sender,
        sender,
      };

    case AccountType.MULTISIG:
      return {
        type: "proposal",
        operations,
        sender,
        signer,
      };
  }
};

export type EstimatedOperation = {
  operations: AccountOperations;
  fee: string;
};

export const toOperation = (
  token: Token,
  value: { amount: string; sender: string; recipient: string }
): FA12Transfer | FA2Transfer => {
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
