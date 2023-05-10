// For now we only allow a wallet user to be a signer of multisig.
export type WalletUserPkh = string;
export type MultisigAddress = string;

// Mapping from a wallet account user to multisigs the accounts are signers of
export type AccountToMultisigs = Record<WalletUserPkh, MultisigAddress[]>;

// Mapping from a multisig address to its signers.
// The multisig should have at least one of the accounts as the signer.
export type MultisigToSigners = Record<MultisigAddress, WalletUserPkh[]>;

export type MultisigLookups = {
  accountToMultisigs: AccountToMultisigs;
  multiSigToSigners: MultisigToSigners;
};
