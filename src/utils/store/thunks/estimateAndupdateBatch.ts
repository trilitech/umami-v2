import { TezosNetwork } from "@airgap/tezos";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { OperationValue } from "../../../components/sendForm/types";
import { zip } from "../../helpers";
import { estimateBatch } from "../../tezos";
import assetsSlice, { BatchItem } from "../assetsSlice";
import { RootState } from "../store";

const {
  updateBatch: addToBatch,
  batchSimulationEnd,
  batchSimulationStart,
} = assetsSlice.actions;
export const estimateAndUpdateBatch = (
  pkh: string,
  pk: string,
  operations: OperationValue[],
  network: TezosNetwork
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    if (operations.length === 0) {
      throw new Error("Can't add empty list of operations to batch!");
    }

    const batches = getState().assets.batches;

    if (batches[pkh]?.isSimulating) {
      throw new Error(`Simulation already ongoing for ${pkh}`);
    }

    dispatch(batchSimulationStart({ pkh }));
    try {
      const estimations = await estimateBatch(operations, pkh, pk, network);
      const items: BatchItem[] = zip(operations, estimations).map(([o, e]) => {
        return {
          fee: e.suggestedFeeMutez,
          operation: o,
        };
      });
      dispatch(addToBatch({ pkh, items }));
    } catch (error) {
      dispatch(batchSimulationEnd({ pkh }));
      throw error;
    }

    dispatch(batchSimulationEnd({ pkh }));
  };
};
