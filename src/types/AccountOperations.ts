import { Account, AccountType, ImplicitAccount, MultisigAccount } from "./Account";
import { Operation } from "./Operation";

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
