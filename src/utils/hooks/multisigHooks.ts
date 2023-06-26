import { ContractAddress } from "../../types/Address";
import { MultisigOperation } from "../multisig/types";
import { useAppSelector } from "../store/hooks";

export const useMultisigs = () => {
  return useAppSelector(s => s.multisigs.items);
};

export const useGetSortedMultisigPendingOperations = (): ((
  address: ContractAddress
) => MultisigOperation[]) => {
  const multisigs = useMultisigs();

  return (address: ContractAddress) => {
    const pendingOperations =
      multisigs.find(multisig => multisig.address === address)?.pendingOperations ?? [];
    return [...pendingOperations].sort((a, b) => Number(b.key) - Number(a.key));
  };
};
