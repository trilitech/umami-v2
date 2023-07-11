import { TezosNetwork } from "@airgap/tezos";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RawOperation } from "../../../types/RawOperation";
import { operationsToBatchItems } from "../../../views/batch/batchUtils";
import assetsSlice from "../assetsSlice";
import { RootState } from "../store";

const { updateBatch: addToBatch, batchSimulationEnd, batchSimulationStart } = assetsSlice.actions;
export const estimateAndUpdateBatch = (
  pkh: string,
  pk: string,
  operations: RawOperation[],
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
      const items = await operationsToBatchItems(operations, pkh, pk, network);
      dispatch(addToBatch({ pkh, items }));
    } catch (error) {
      dispatch(batchSimulationEnd({ pkh }));
      throw error;
    }

    dispatch(batchSimulationEnd({ pkh }));
  };
};
