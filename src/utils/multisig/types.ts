import { ContractAddress, ImplicitAddress } from "../../types/Address";

export type MultisigOperation = {
  key: string;
  rawActions: string;
  approvals: ImplicitAddress[];
};

export type MultisigWithPendingOperations = {
  address: ContractAddress;
  threshold: number;
  signers: ImplicitAddress[];
  balance: string;
  pendingOperations: MultisigOperation[];
};

export type AccountToMultisigs = Record<
  string, // pkh
  MultisigWithPendingOperations[] | undefined
>;
