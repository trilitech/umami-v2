import { Account } from "../../types/Account";
import { useAppDispatch } from "../redux/hooks";
import { batchesSlice } from "../redux/slices/batches";

/**
 * Hook for removing all stored accounts' dependencies.
 *
 * That means:
 * - removing all batches related to the given accounts
 */
export const useRemoveAccountsDependencies = () => {
  const dispatch = useAppDispatch();

  return (accounts: Account[]) => {
    const pkhs = accounts.map(account => account.address.pkh);
    dispatch(batchesSlice.actions.removeByAccounts({ pkhs }));
  };
};
