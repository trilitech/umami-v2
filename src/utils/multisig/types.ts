import { ContractAddress, ImplicitAddress } from "../../types/Address";

type BigmapId = number;

export type MultisigOperation = {
  id: string;
  bigmapId: BigmapId;
  rawActions: string;
  approvals: ImplicitAddress[];
};

export type Multisig = {
  address: ContractAddress;
  threshold: number;
  signers: ImplicitAddress[];
  pendingOperationsBigmapId: BigmapId;
};

export type MultisigPendingOperations = Record<BigmapId, MultisigOperation[] | undefined>;
