import { ContractAddress } from "../../types/Address";
import { MultisigOperation, MultisigOperationId } from "../multisig/types";
import { useAppSelector } from "../store/hooks";

export const useMultisigs = () => {
  return useAppSelector(s => s.multisigs.items);
};

const useGetPendingOperations = (): ((id: MultisigOperationId) => MultisigOperation[]) => {
  const pendingOperaions = useAppSelector(s => s.multisigs.pendingOperations);
  return (id: MultisigOperationId) => {
    return pendingOperaions[id] ?? [];
  };
};

export const useGetSortedMultisigPendingOperations = (): ((
  address: ContractAddress
) => MultisigOperation[]) => {
  const multisigs = useMultisigs();

  const getPendingOperations = useGetPendingOperations();
  return (address: ContractAddress) => {
    const pendingOperationsId = multisigs.find(
      multisig => multisig.address === address
    )?.pendingOperations;

    if (pendingOperationsId === undefined) {
      return [];
    }

    return [...getPendingOperations(pendingOperationsId)].sort(
      (a, b) => Number(b.key) - Number(a.key)
    );
  };
};
