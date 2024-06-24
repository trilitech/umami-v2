import { type BigmapId, type ContractAddress, type ImplicitAddress } from "@umami/tezos";

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

export type RawTzktMultisigContract = {
  address: string;
  storage: {
    signers: string[];
    threshold: string;
    pending_ops: number; //bigmap id for the operations
  };
};

export type RawTzktMultisigBigMap = {
  bigmap: number;
  active: boolean;
  key: string | null;
  value: {
    actions: string;
    approvals: string[];
  } | null;
};
