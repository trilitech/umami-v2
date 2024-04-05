import { useImplicitAccounts } from "./getAccountDataHooks";
import { useMultisigAccounts } from "./multisigHooks";
import { Account, ImplicitAccount } from "../../types/Account";
import { useRemovePeersByAccounts } from "../beacon/beacon";
import { useAppDispatch } from "../redux/hooks";
import { assetsSlice } from "../redux/slices/assetsSlice";
import { batchesSlice } from "../redux/slices/batches";
import { beaconSlice } from "../redux/slices/beaconSlice";
import { multisigsSlice } from "../redux/slices/multisigsSlice";

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

    dispatch(multisigsSlice.actions.removeMultisigsData(multisigsToRemove.map(m => m.address.pkh)));
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
    dispatch(batchesSlice.actions.removeByAccounts(pkhs));
    void removePeersByAccounts(pkhs);
    dispatch(beaconSlice.actions.removeConnections(pkhs));
    dispatch(assetsSlice.actions.removeAccountsData(pkhs));
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
