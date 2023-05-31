import { TezosNetwork } from "@airgap/tezos";
import { compact } from "lodash";
import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { getPendingOperations } from "./fetch";
import {
  AccountToMultisigs,
  Multisig,
  MultisigLookups,
  MultisigToSigners,
  MultisigWithPendings,
  WalletUserPkh,
} from "./types";

type Lookups = {
  accountToMultisigs: AccountToMultisigs;
  multiSigToSigners: MultisigToSigners;
};

// Filter out the multisgs the accountPkhs are not included.
export const filterMultisigs = (
  accountPkhs: Set<WalletUserPkh>,
  multisigs: tzktGetSameMultisigsResponseType
): Lookups =>
  multisigs.reduce(
    (acc: Lookups, cur) => {
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
          pendingOps: pending_ops,
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

  const accountToMultisigsWithPendings = await Promise.all(
    Object.entries(accountToMultisigs).map(async ([account, multisigs]) => {
      if (!multisigs) {
        return;
      }

      const multisigsWithPendings = await getMultisigsWithPendings(
        network,
        multisigs
      );

      return [account, multisigsWithPendings];
    })
  ).then(compact);

  return {
    multiSigToSigners,
    accountToMultisigsWithPendings: Object.fromEntries(
      accountToMultisigsWithPendings
    ),
  };
};

const getMultisigsWithPendings = async (
  network: TezosNetwork,
  multisigs: Multisig[]
): Promise<MultisigWithPendings[]> => {
  const multisigsWithPendings = await Promise.all(
    multisigs.map(async ({ address, pendingOps, threshold }) => {
      const pendings = await getPendingOperations(network, pendingOps).then(
        (response) =>
          compact(
            response
              .filter((pendings) => pendings.active)
              .map((pendings) => {
                if (!pendings.value || !pendings.key) {
                  return null;
                }
                return {
                  key: pendings.key,
                  rawActions: pendings.value.actions,
                  approvals: pendings.value.approvals as WalletUserPkh[],
                };
              })
          )
      );

      return { address, pendings, threshold };
    })
  ).then(compact);

  return multisigsWithPendings;
};
