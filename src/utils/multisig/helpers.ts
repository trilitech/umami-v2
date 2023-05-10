import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { AccountToMultisigs, MultisigToSigners, WalletUserPkh } from "./types";

type MultisigLookups = {
  multiSigToSigners: MultisigToSigners;
  accountToMultisigs: AccountToMultisigs;
};

export const makeMultisigLookups = (
  accountPkhs: Set<WalletUserPkh>,
  multisigs: tzktGetSameMultisigsResponseType
): MultisigLookups =>
  multisigs.reduce(
    (acc: MultisigLookups, cur) => {
      const {
        address: multisigAddress,
        storage: { signers },
      } = cur;

      const { multiSigToSigners, accountToMultisigs } = acc;

      const intersection = signers.filter((s) => accountPkhs.has(s));

      // Ignore multisigs the user aaccounts are not the signer of
      if (intersection.length === 0) {
        return acc;
      }

      intersection.forEach((pkh) => {
        const existing = accountToMultisigs[pkh] ?? [];
        accountToMultisigs[pkh] = [...existing, multisigAddress];
      });

      return {
        multiSigToSigners: { ...multiSigToSigners, [multisigAddress]: signers },
        accountToMultisigs,
      };
    },
    {
      multiSigToSigners: {},
      accountToMultisigs: {},
    }
  );
