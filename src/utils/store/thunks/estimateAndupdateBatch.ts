import { TezosNetwork } from "@airgap/tezos";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { TransactionValues } from "../../../components/sendForm/types";
import { zip } from "../../helpers";
import assetsSlice, { BatchItem } from "../assetsSlice";
import { RootState } from "../store";
import { estimateBatch } from "../../tezos/estimate";

const {
  updateBatch: addToBatch,
  batchSimulationEnd,
  batchSimulationStart,
} = assetsSlice.actions;
export const estimateAndUpdateBatch = (
  pkh: string,
  pk: string,
  transactions: TransactionValues[],
  network: TezosNetwork
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    if (transactions.length === 0) {
      throw new Error("Can't add empty list of transactions to batch!");
    }

    const batches = getState().assets.batches;

    if (batches[pkh]?.isSimulating) {
      throw new Error(`Simulation already ongoing for ${pkh}`);
    }

    dispatch(batchSimulationStart({ pkh }));
    try {
      const estimations = await estimateBatch(transactions, pkh, pk, network);
      const items: BatchItem[] = zip(transactions, estimations).map(
        ([t, e]) => {
          return {
            fee: e.suggestedFeeMutez,
            transaction: t,
          };
        }
      );
      dispatch(addToBatch({ pkh, items }));
    } catch (error) {
      dispatch(batchSimulationEnd({ pkh }));
      throw error;
    }

    dispatch(batchSimulationEnd({ pkh }));
  };
};
