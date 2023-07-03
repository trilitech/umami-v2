import { ContractAddress, ImplicitAddress } from "../../types/Address";

export type MultisigOperationId = number;

export type MultisigOperation = {
  id: MultisigOperationId;
  key: string;
  rawActions: string;
  approvals: ImplicitAddress[];
};

export type Multisig = {
  address: ContractAddress;
  threshold: number;
  signers: ImplicitAddress[];
  pendingOperations: MultisigOperationId;
};

export type MultisigPendingOperations = Record<MultisigOperationId, MultisigOperation[]>;
