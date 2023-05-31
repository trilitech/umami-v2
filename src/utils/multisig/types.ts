// For now we only allow a wallet user to be a signer of multisig.
export type WalletUserPkh = string;
export type MultisigAddress = string;
export type PendingOps = number;

export type Multisig = {
  address: MultisigAddress;
  pendingOps: PendingOps;
  threshold: number;
};

// Mapping from a wallet account user to multisigs the accounts are signers of
export type AccountToMultisigs = Record<WalletUserPkh, Multisig[] | undefined>;

// Mapping from a multisig address to its signers.
// The multisig should have at least one of the accounts as the signer.
export type MultisigToSigners = Record<
  MultisigAddress,
  WalletUserPkh[] | undefined
>;

export type MultisigWithPendings = {
  address: MultisigAddress;
  pendings: {
    key: string;
    rawActions: string;
    approvals: WalletUserPkh[];
  }[];
  threshold: number;
};

export type MultisigLookups = {
  accountToMultisigsWithPendings: Record<
    WalletUserPkh,
    MultisigWithPendings[] | undefined
  >;
  multiSigToSigners: MultisigToSigners;
};
