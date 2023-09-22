import { AccountType, MultisigAccount } from "../../types/Account";
import { compact } from "lodash";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
import { RawTzktGetBigMapKeysItem, RawTzktGetSameMultisigsItem } from "../tzkt/types";
import { getAllMultiSigContracts, getPendingOperations } from "./fetch";
import { Multisig, MultisigOperation } from "./types";
import { Network } from "../../types/Network";
import { withRateLimit } from "../tezos";

export const parseMultisig = (raw: RawTzktGetSameMultisigsItem): Multisig => ({
  address: parseContractPkh(raw.address),
  threshold: Number(raw.storage.threshold),
  // For now, we assume the singer is always an implicit account
  signers: raw.storage.signers.map(parseImplicitPkh),
  pendingOperationsBigmapId: raw.storage.pending_ops,
});

export const getRelevantMultisigContracts = async (
  accountPkhs: Set<string>,
  network: Network
): Promise<Multisig[]> =>
  withRateLimit(() =>
    getAllMultiSigContracts(network).then(multisigs =>
      multisigs
        .filter(({ storage: { signers } }) => {
          const intersection = signers.filter(s => accountPkhs.has(s));
          return intersection.length > 0;
        })
        .map(parseMultisig)
    )
  );

const parseMultisigOperation = (raw: RawTzktGetBigMapKeysItem): MultisigOperation => {
  const { bigmap, key, value } = raw;
  if (key === null || value === null) {
    throw new Error("parseMultisigOperation failed");
  }

  return {
    id: key,
    bigmapId: bigmap,
    rawActions: value.actions,
    // For now, we assume the approver is always an implicit account
    approvals: value.approvals.map(parseImplicitPkh),
  };
};

export const getPendingOperationsForMultisigs = async (
  multisigs: Multisig[],
  network: Network
): Promise<MultisigOperation[]> => {
  if (multisigs.length === 0) {
    return [];
  }
  return withRateLimit(async () => {
    const bigmapIds = multisigs.map(m => m.pendingOperationsBigmapId);

    const response = await getPendingOperations(bigmapIds, network);

    return compact(response.map(parseMultisigOperation));
  });
};

export const multisigToAccount = (multisig: Multisig, label: string): MultisigAccount => {
  return {
    label,
    type: AccountType.MULTISIG,
    ...multisig,
  };
};
