import { TezosNetwork } from "@airgap/tezos";
import { compact } from "lodash";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
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

export const getOperationsForMultisigs = async (
  network: TezosNetwork,
  multisigs: tzktGetSameMultisigsResponseType
): Promise<MultisigWithPendingOperations[]> => {
  const multisigsWithOperations = await Promise.all(
    multisigs.map(async ({ address, balance, storage: { signers, pending_ops, threshold } }) => {
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
        balance: balance.toString(),
        pendingOperations: compact(operations),
      };
    })
  );

  return multisigsWithOperations;
};
