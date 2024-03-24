import { compact, every } from "lodash";

import { getAllMultiSigContracts, getExistingContracts, getPendingOperations } from "./fetch";
import { Multisig, MultisigOperation } from "./types";
import { MultisigAccount } from "../../types/Account";
import {
  RawPkh,
  isValidImplicitPkh,
  parseContractPkh,
  parseImplicitPkh,
} from "../../types/Address";
import { Network } from "../../types/Network";
import { useAvailableNetworks } from "../hooks/networkHooks";
import { withRateLimit } from "../tezos";
import { RawTzktGetBigMapKeysItem, RawTzktGetSameMultisigsItem } from "../tzkt/types";

export const parseMultisig = (raw: RawTzktGetSameMultisigsItem): Multisig => ({
  address: parseContractPkh(raw.address),
  threshold: Number(raw.storage.threshold),
  signers: raw.storage.signers.map(parseImplicitPkh),
  pendingOperationsBigmapId: raw.storage.pending_ops,
});

export const getRelevantMultisigContracts = async (
  accountPkhs: Set<string>,
  network: Network
): Promise<Multisig[]> =>
  withRateLimit(async () => {
    const multisigs = await getAllMultiSigContracts(network);
    return multisigs
      .filter(({ storage: { signers } }) => {
        // For now, we assume the signer is always an implicit account
        if (!every(signers, isValidImplicitPkh)) {
          return false;
        }
        const intersection = signers.filter(s => accountPkhs.has(s));
        return intersection.length > 0;
      })
      .map(parseMultisig);
  });

/**
 * Checks which of the given multisig addresses exist in the given network.
 *
 * @param network - network to check.
 * @param accountPkhs - multisig addresses to check.
 * @returns list of addresses that exist in the network.
 */
export const getExistingContractAddresses = async (
  network: Network,
  accountPkhs: Set<RawPkh>
): Promise<RawPkh[]> =>
  withRateLimit(async () => {
    const contracts = await getExistingContracts(network, Array.from(accountPkhs));
    return contracts.map(raw => parseContractPkh(raw.address).pkh);
  });

export const useGetNetworksForContracts = () => {
  const availableNetworks = useAvailableNetworks();

  return async (accountPkhs: Set<RawPkh>): Promise<Map<RawPkh, string>> => {
    const result = new Map<RawPkh, string>();

    const accountsWithNetwork = await Promise.all(
      availableNetworks.map(async network =>
        (await getExistingContractAddresses(network, accountPkhs)).map(pkh => [pkh, network.name])
      )
    );
    accountsWithNetwork.flat().forEach(([pkh, network]) => result.set(pkh, network));

    return result;
  };
};

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

export const multisigToAccount = (multisig: Multisig, label: string): MultisigAccount => ({
  label,
  type: "multisig",
  ...multisig,
});
