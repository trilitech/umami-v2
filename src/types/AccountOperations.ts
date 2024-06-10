import BigNumber from "bignumber.js";

import { Account, ImplicitAccount, MultisigAccount } from "./Account";
import { Operation } from "./Operation";
import { type Estimation } from "../utils/tezos/types";

type ProposalOperations = {
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
export type EstimatedAccountOperations = AccountOperations & {
  estimates: Estimation[];
};

export const totalFee = (estimates: Estimation[]): number =>
  estimates
    .map(estimate => estimate.fee)
    .reduce((acc, curr) => acc.plus(curr), BigNumber(0))
    .toNumber();

export const makeAccountOperations = (
  sender: Account,
  signer: ImplicitAccount,
  operations: Operation[]
): AccountOperations => {
  switch (sender.type) {
    case "ledger":
    case "mnemonic":
    case "social":
    case "secret_key":
      if (sender.address.pkh !== signer.address.pkh) {
        throw new Error("Sender and Signer must be the same");
      }
      return {
        type: "implicit",
        operations,
        signer: sender,
        sender,
      };

    case "multisig":
      return {
        type: "proposal",
        operations,
        sender,
        signer,
      };
  }
};
