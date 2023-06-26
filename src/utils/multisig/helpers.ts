import { TezosNetwork } from "@airgap/tezos";
import { compact } from "lodash";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
import { processInBatches } from "../promise";
import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { getAllMultiSigContracts, getPendingOperations } from "./fetch";
import { MultisigWithPendingOperations } from "./types";

export const getRelevantMultisigContracts = async (
  network: TezosNetwork,
  accountPkhs: Set<string>
): Promise<tzktGetSameMultisigsResponseType> => {
  const multisigs = await getAllMultiSigContracts(network);
  return multisigs.filter(({ storage: { signers } }) => {
    const intersection = signers.filter(s => accountPkhs.has(s));
    return intersection.length > 0;
  });
};

export const getPendingOperationsForMultisigs = async (
  network: TezosNetwork,
  multisigs: tzktGetSameMultisigsResponseType,
  chunkSize = 5
): Promise<MultisigWithPendingOperations[]> => {
  return processInBatches(
    multisigs,
    chunkSize,
    async ({ address, storage: { signers, pending_ops, threshold } }) => {
      const response = await getPendingOperations(network, pending_ops);

      const operations = response.map(({ key, value }) => {
        if (!value || !key) {
          return null;
        }
        return {
          key,
          rawActions: value.actions,
          approvals: value.approvals.map(parseImplicitPkh),
        };
      });

      return {
        address: parseContractPkh(address),
        threshold: Number(threshold),
        signers: signers.map(parseImplicitPkh),
        pendingOperations: compact(operations),
      } as MultisigWithPendingOperations;
    }
  );
};
