import { Multisig, MultisigOperation } from "../multisig/types";
import { useAppSelector } from "../redux/hooks";

export const useMultisigAccounts = () => useAppSelector(s => s.multisigs.items);

export const useGetPendingMultisigOperations = (): ((account: Multisig) => MultisigOperation[]) => {
  const pendingOperations = useAppSelector(s => s.multisigs.pendingOperations);

  return (account: Multisig) => {
    const pendings = pendingOperations[account.pendingOperationsBigmapId] ?? [];
    return [...pendings].sort((a, b) => Number(b.id) - Number(a.id));
  };
};
