// For now we only allow a wallet user to be a signer of multisig.
export type WalletAccountPkh = string;
export type MultisigAddress = string;

export type MultisigOperation = {
  key: string;
  rawActions: string;
  approvals: WalletAccountPkh[];
};

export type MultisigWithOperations = {
  address: MultisigAddress;
  threshold: number;
  signers: WalletAccountPkh[];
  balance: string;
  operations: MultisigOperation[];
};

export type AccountToMultisigs = Record<
  WalletAccountPkh,
  MultisigWithOperations[] | undefined
>;
