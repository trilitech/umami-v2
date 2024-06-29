import { type Account } from "@umami/core";

import { useSelectedNetwork } from "./network";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { batchesActions } from "../slices";

export const useBatches = () => {
  const network = useSelectedNetwork();
  const batches = useAppSelector(s => s.batches[network.name]);
  return batches || [];
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
