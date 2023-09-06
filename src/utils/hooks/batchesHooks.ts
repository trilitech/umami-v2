import { Account } from "../../types/Account";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { batchesActions } from "../redux/slices/batches";
import { useSelectedNetwork } from "./networkHooks";

export const useBatches = () => {
  const network = useSelectedNetwork();
  return useAppSelector(s => s.batches[network.name] || []);
};

export const useClearBatch = () => {
  const dispatch = useAppDispatch();
  const network = useSelectedNetwork();

  return (account: Account) =>
    dispatch(batchesActions.clear({ pkh: account.address.pkh, network }));
};

export const useRemoveBatchItem = () => {
  const dispatch = useAppDispatch();
  const network = useSelectedNetwork();

  return (account: Account, index: number) =>
    dispatch(batchesActions.removeItem({ pkh: account.address.pkh, index, network }));
};
