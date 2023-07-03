import { TezosNetwork } from "@airgap/tezos";
import { AccountType, MultisigAccount } from "../../types/Account";
import { compact } from "lodash";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
import { RawTzktGetBigMapKeysItem, RawTzktGetSameMultisigsItem } from "../tzkt/types";
import { getAllMultiSigContracts, getPendingOperations } from "./fetch";
import { Multisig, MultisigOperation } from "./types";

export const parseMultisig = (raw: RawTzktGetSameMultisigsItem): Multisig => ({
  address: parseContractPkh(raw.address),
  threshold: Number(raw.storage.threshold),
  // For now, we assume the singer is always an implicit account
  signers: raw.storage.signers.map(parseImplicitPkh),
  pendingOperations: raw.storage.pending_ops,
});

export const getRelevantMultisigContracts = async (
  accountPkhs: Set<string>,
  network: TezosNetwork
): Promise<Multisig[]> =>
  getAllMultiSigContracts(network).then(multisigs =>
    multisigs
      .filter(({ storage: { signers } }) => {
        const intersection = signers.filter(s => accountPkhs.has(s));
        return intersection.length > 0;
      })
      .map(parseMultisig)
  );

const parseMultisigOperation = (raw: RawTzktGetBigMapKeysItem): MultisigOperation | null => {
  const { bigmap, key, value } = raw;
  if (key === null || value === null) {
    return null;
  }

  return {
    id: bigmap,
    key,
    rawActions: value.actions,
    // For now, we assume the approver is always an implicit account
    approvals: value.approvals.map(parseImplicitPkh),
  };
};

export const getPendingOperationsForMultisigs = async (
  multisigs: Multisig[],
  network: TezosNetwork
): Promise<MultisigOperation[]> => {
  const bigmapIds = multisigs.map(m => m.pendingOperations);

  const response = await getPendingOperations(bigmapIds, network);

  return compact(response.map(parseMultisigOperation));
};

export const multisigToAccount = (m: Multisig, label: string): MultisigAccount => {
  return {
    label,
    address: m.address,
    type: AccountType.MULTISIG,
    threshold: m.threshold,
    signers: m.signers,
  };
};
