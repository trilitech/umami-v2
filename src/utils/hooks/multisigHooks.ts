import { useImplicitAccounts } from "./getAccountDataHooks";
import { useRemoveAccountsDependencies } from "./removeAccountDependenciesHooks";
import { MultisigAccount } from "../../types/Account";
import { MultisigOperation } from "../multisig/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { multisigsSlice } from "../redux/slices/multisigsSlice";

export const useMultisigAccounts = () => useAppSelector(s => s.multisigs.items);

export const useGetPendingMultisigOperations = (): ((
  account: MultisigAccount
) => MultisigOperation[]) => {
  const pendingOperations = useAppSelector(s => s.multisigs.pendingOperations);

  return (account: MultisigAccount) => {
    const pendings = pendingOperations[account.pendingOperationsBigmapId] ?? [];
    return [...pendings].sort((a, b) => Number(b.id) - Number(a.id));
  };
};

export const useRemoveObsoleteMultisigs = () => {
  const dispatch = useAppDispatch();
  const implicit = useImplicitAccounts();
  const multisig = useMultisigAccounts();
  const removeAccountsDependencies = useRemoveAccountsDependencies();

  return () => {
    // TODO: check this works OK as part of accounts removal
    const remainingPkhs = implicit.map(account => account.address);

    const multisigsToRemove = multisig
      .filter(multisig => !multisig.signers.some(signer => remainingPkhs.includes(signer)))
      .map(multisig => multisig);

    removeAccountsDependencies(multisigsToRemove);
    dispatch(multisigsSlice.actions.removeMultisigs(multisigsToRemove.map(m => m.address.pkh)));
  };
};
