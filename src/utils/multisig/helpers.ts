import { TezosNetwork } from "@airgap/tezos";
import { compact } from "lodash";
import { AccountType, MultisigAccount } from "../../types/Account";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
import { RawTzktGetBigMapKeysItem, tzktGetSameMultisigsResponseType } from "../tzkt/types";
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
  multisigs: tzktGetSameMultisigsResponseType
): Promise<MultisigWithPendingOperations[]> => {
  const bigmapIds = multisigs.map(m => m.storage.pending_ops);

  const bigmapLookup = await getPendingOperations(network, bigmapIds).then(response =>
    response.reduce((acc: Record<number, RawTzktGetBigMapKeysItem[] | undefined>, cur) => {
      if (!acc[cur.bigmap]) {
        acc[cur.bigmap] = [];
      }
      acc[cur.bigmap]?.push(cur);
      return acc;
    }, {})
  );

  return multisigs.map(({ address, storage: { signers, pending_ops, threshold } }) => {
    const operations = bigmapLookup[pending_ops]?.map(({ key, value }) => {
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
    };
  });
};

export const multisigWithPendingOpsToAccount = (
  m: MultisigWithPendingOperations,
  label: string
): MultisigAccount => {
  return {
    label,
    address: m.address,
    type: AccountType.MULTISIG,
    threshold: m.threshold,
    signers: m.signers,
  };
};
