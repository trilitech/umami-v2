// For now we only allow a wallet user to be a signer of multisig.
export type WalletUserPkh = string;
export type MultisigAddress = string;

type MultisigBase = {
  address: MultisigAddress;
  threshold: number;
};

export type Multisig = MultisigBase & {
  pendingOpsId: number; //Used to fetch the pending operations.
};

export type MultisigWithPendingOps = MultisigBase & {
  pendingOps: {
    key: string;
    rawActions: string;
    approvals: WalletUserPkh[];
  }[];
};

// Mapping from a wallet account user to multisigs the accounts are signers of
export type AccountToMultisigs = Record<WalletUserPkh, Multisig[] | undefined>;
export type AccountToMultisigsWithPendingOps = Record<
  WalletUserPkh,
  MultisigWithPendingOps[] | undefined
>;

// Mapping from a multisig address to its signers.
// The multisig should have at least one of the accounts as the signer.
export type MultisigToSigners = Record<
  MultisigAddress,
  WalletUserPkh[] | undefined
>;

export type MultisigLookups = {
  accountToMultisigsWithPendingOps: AccountToMultisigsWithPendingOps;
  multiSigToSigners: MultisigToSigners;
};
