import { ContractAddress } from "../../types/Address";
import { MultisigOperation } from "../multisig/types";
import { useAppSelector } from "../store/hooks";

export const useMultisigs = () => {
  return useAppSelector(s => s.multisigs.items);
};

export const useGetMultisigPendingOperations = (): ((
  address: ContractAddress
) => MultisigOperation[]) => {
  const multisigs = useMultisigs();

  return (address: ContractAddress) =>
    multisigs.find(multisig => multisig.address === address)?.pendingOperations ?? [];
};
