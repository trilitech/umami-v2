import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { MultisigLookups, WalletUserPkh } from "./types";

export const makeMultisigLookups = (
  accountPkhs: Set<WalletUserPkh>,
  multisigs: tzktGetSameMultisigsResponseType
): MultisigLookups =>
  multisigs.reduce(
    (acc: MultisigLookups, cur) => {
      const {
        address: multisigAddress,
        storage: { signers, pending_ops },
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
        acc.accountToMultisigs[pkh]?.push([multisigAddress, pending_ops]);
      });

      acc.multiSigToSigners[multisigAddress] = signers;

      return acc;
    },
    {
      multiSigToSigners: {},
      accountToMultisigs: {},
    }
  );
