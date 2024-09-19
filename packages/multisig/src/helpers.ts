import {
  type Network,
  type RawPkh,
  isValidImplicitPkh,
  parseContractPkh,
  parseImplicitPkh,
} from "@umami/tezos";
import { compact, every } from "lodash";

import {
  getAllMultisigContracts,
  getExistingContracts,
  getPendingOperationsForMultisigs,
} from "./fetch";
import {
  type Multisig,
  type MultisigOperation,
  type RawTzktMultisigBigMap,
  type RawTzktMultisigContract,
} from "./types";

export const parseMultisig = (raw: RawTzktMultisigContract): Multisig => ({
  address: parseContractPkh(raw.address),
  threshold: Number(raw.storage.threshold),
  signers: raw.storage.signers.map(parseImplicitPkh),
  pendingOperationsBigmapId: raw.storage.pending_ops,
});

export const getRelevantMultisigContracts = async (
  accountPkhs: Set<string>,
  network: Network
): Promise<Multisig[]> => {
  const multisigs = await getAllMultisigContracts(network);
  return multisigs
    .filter(({ storage: { signers } }) => {
      // For now, we assume the signer is always an implicit account
      if (!every(signers, isValidImplicitPkh)) {
        return false;
      }
      const intersection = signers.filter(signer => accountPkhs.has(signer));
      return intersection.length > 0;
    })
    .map(parseMultisig);
};

/**
 * Checks which of the given contract addresses exist in the given network.
 *
 * @param availableNetworks - network to check.
 * @param contractPkhs - contract addresses to check.
 * @returns map from existing addresses to their corresponding networks.
 */
export const getNetworksForContracts = async (
  availableNetworks: Network[],
  contractPkhs: RawPkh[]
): Promise<Map<RawPkh, string>> => {
  const result = new Map<RawPkh, string>();

  if (contractPkhs.length === 0) {
    return result;
  }

  const accountsWithNetwork = await Promise.all(
    availableNetworks.map(async network =>
      (await getExistingContracts(contractPkhs, network)).map(contractPkh => [
        contractPkh,
        network.name,
      ])
    )
  );
  accountsWithNetwork.flat().forEach(([pkh, network]) => result.set(pkh, network));
  return result;
};

const parseMultisigOperation = (raw: RawTzktMultisigBigMap): MultisigOperation => {
  const { bigmap, key, value } = raw;
  if (key === null || value === null) {
    throw new Error("parseMultisigOperation failed");
  }

  return {
    id: key,
    bigmapId: bigmap,
    rawActions: value.actions,
    // For now, we assume the approver is always an implicit account
    approvals: value.approvals?.map(parseImplicitPkh) ?? [],
  };
};

export const getPendingOperations = async (
  multisigs: Multisig[],
  network: Network
): Promise<MultisigOperation[]> => {
  if (multisigs.length === 0) {
    return [];
  }

  const bigmapIds = multisigs.map(m => m.pendingOperationsBigmapId);

  const response = await getPendingOperationsForMultisigs(bigmapIds, network);

  return compact(response.map(parseMultisigOperation));
};
