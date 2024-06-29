import { type Account, type ImplicitAccount } from "@umami/core";

import { useRemovePeersByAccounts } from "./beacon";
import { useImplicitAccounts } from "./getAccountData";
import { useMultisigAccounts } from "./multisig";
import { useAppDispatch } from "./useAppDispatch";
import { assetsActions, batchesActions, beaconActions, multisigsActions } from "../slices";

/**
 * Hook for cleaning up data related to deleted accounts.
 *
 * Removes
 *   - deleted accounts dependencies
 *   - obsolete multisigs' dependencies
 *
 * Multisigs themselves are not being removed here, but will be cleaned up on the next data refetch.
 */
export const useRemoveDependenciesAndMultisigs = () => {
  const dispatch = useAppDispatch();
  const getMultisigsToRemove = useGetMultisigsToRemove();
  const removeAccountsDependencies = useRemoveAccountsDependencies();

  return (accountsToRemove: ImplicitAccount[]) => {
    const multisigsToRemove = getMultisigsToRemove(accountsToRemove);

    removeAccountsDependencies([...accountsToRemove, ...multisigsToRemove]);

    dispatch(multisigsActions.removeMultisigsData(multisigsToRemove.map(m => m.address.pkh)));
  };
};

/**
 * Hook for removing stored accounts' data.
 *
 * That means:
 * - removing all batches related to the given accounts
 * - removing all peers related to the given accounts
 * - balances of the given accounts
 */
const useRemoveAccountsDependencies = () => {
  const dispatch = useAppDispatch();
  const removePeersByAccounts = useRemovePeersByAccounts();

  return (accounts: Account[]) => {
    const pkhs = accounts.map(account => account.address.pkh);
    dispatch(batchesActions.removeByAccounts(pkhs));
    void removePeersByAccounts(pkhs);
    dispatch(beaconActions.removeConnections(pkhs));
    dispatch(assetsActions.removeAccountsData(pkhs));
  };
};

/**
 * Hook for getting obsolete multisigs.
 *
 * I. e. multisigs for which all signer accounts were removed.
 *
 * Hook checks currently stored implicit accounts, but ignores deletedAccounts.
 */
const useGetMultisigsToRemove = () => {
  const implicit = useImplicitAccounts();
  const multisig = useMultisigAccounts();

  return (accountsToRemove: ImplicitAccount[]) => {
    const deletedPkhs = accountsToRemove.map(account => account.address.pkh);
    const remainingPkhs = implicit
      .map(account => account.address.pkh)
      .filter(address => !deletedPkhs.includes(address));
    return multisig.filter(
      multisig => !multisig.signers.some(signer => remainingPkhs.includes(signer.pkh))
    );
  };
};
