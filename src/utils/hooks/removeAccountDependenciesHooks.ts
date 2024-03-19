import { Account } from "../../types/Account";
import { useRemovePeersByAccounts } from "../beacon/beacon";
import { useAppDispatch } from "../redux/hooks";
import { assetsSlice } from "../redux/slices/assetsSlice";
import { batchesSlice } from "../redux/slices/batches";
import { beaconSlice } from "../redux/slices/beaconSlice";

/**
 * Hook for removing all stored accounts' dependencies.
 *
 * That means:
 * - removing all batches related to the given accounts
 */
export const useRemoveAccountsDependencies = () => {
  const dispatch = useAppDispatch();
  const removePeersByAccounts = useRemovePeersByAccounts();

  return (accounts: Account[]) => {
    const pkhs = accounts.map(account => account.address.pkh);
    dispatch(batchesSlice.actions.removeByAccounts({ pkhs }));
    void removePeersByAccounts(pkhs);
    dispatch(beaconSlice.actions.removeConnections({ pkhs }));
    dispatch(assetsSlice.actions.removeAccountsData({ pkhs }));
  };
};
