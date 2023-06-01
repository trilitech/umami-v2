import { TezosNetwork } from "@airgap/tezos";
import { compact } from "lodash";
import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { getPendingOperations } from "./fetch";
import {
  AccountToMultisigs,
  Multisig,
  MultisigLookups,
  MultisigToSigners,
  MultisigWithPendingOps,
  WalletUserPkh,
} from "./types";

type FilteredLookups = {
  accountToMultisigs: AccountToMultisigs;
  multiSigToSigners: MultisigToSigners;
};

// Filter out the multisgs the accountPkhs are not included and construct lookups.
export const filterMultisigs = (
  accountPkhs: Set<WalletUserPkh>,
  multisigs: tzktGetSameMultisigsResponseType
): FilteredLookups =>
  multisigs.reduce(
    (acc: FilteredLookups, cur) => {
      const {
        address: multisigAddress,
        storage: { signers, pending_ops, threshold },
      } = cur;

      const intersection = signers.filter((s) => accountPkhs.has(s));

      // Ignore multisigs the user aaccounts are not the signer of
      if (intersection.length === 0) {
        return acc;
      }

      intersection.forEach((pkh) => {
        if (!(pkh in acc.accountToMultisigs)) {
          acc.accountToMultisigs[pkh] = [];
        }
        acc.accountToMultisigs[pkh]?.push({
          address: multisigAddress,
          pendingOpsId: pending_ops,
          threshold: Number(threshold),
        });
      });

      acc.multiSigToSigners[multisigAddress] = signers;

      return acc;
    },
    {
      multiSigToSigners: {},
      accountToMultisigs: {},
    }
  );

export const makeMultisigLookups = async (
  network: TezosNetwork,
  accountPkhs: Set<WalletUserPkh>,
  multisigs: tzktGetSameMultisigsResponseType
): Promise<MultisigLookups> => {
  const { multiSigToSigners, accountToMultisigs } = filterMultisigs(
    accountPkhs,
    multisigs
  );

  const accountToMultisigsWithPendingOpsPairs = await Promise.all(
    Object.entries(accountToMultisigs).map(async ([account, multisigs]) => {
      if (!multisigs) {
        return null;
      }

      const multisigsWithPendingOps = await getMultisigsWithPendingOps(
        network,
        multisigs
      );

      return [account, multisigsWithPendingOps];
    })
  ).then(compact);

  return {
    multiSigToSigners,
    accountToMultisigsWithPendingOps: Object.fromEntries(
      accountToMultisigsWithPendingOpsPairs
    ),
  };
};

export const getMultisigsWithPendingOps = async (
  network: TezosNetwork,
  multisigs: Multisig[]
): Promise<MultisigWithPendingOps[]> => {
  const multisigsWithPendings = await Promise.all(
    multisigs.map(async ({ address, pendingOpsId, threshold }) => {
      const response = await getPendingOperations(network, pendingOpsId);

      const pendingOps = response
        .filter(({ active }) => active)
        .map(({ key, value }) => {
          if (!value || !key) {
            return null;
          }
          return {
            key,
            rawActions: value.actions,
            approvals: value.approvals,
          };
        });

      return { address, pendingOps: compact(pendingOps), threshold };
    })
  );

  return multisigsWithPendings;
};
