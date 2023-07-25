import { MultisigAccount } from "../../types/Account";
import { MultisigOperation } from "../multisig/types";
import { useAppSelector } from "../redux/hooks";

export const useMultisigs = () => {
  return useAppSelector(s => s.multisigs.items);
};

export const useGetPendingOperations = (): ((account: MultisigAccount) => MultisigOperation[]) => {
  const pendingOperations = useAppSelector(s => s.multisigs.pendingOperations);

  return (account: MultisigAccount) => {
    const pendings = pendingOperations[account.pendingOperationsBigmapId] ?? [];
    return [...pendings].sort((a, b) => Number(b.id) - Number(a.id));
  };
};
