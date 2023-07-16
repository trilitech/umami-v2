import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { OperationValue } from "../../../components/sendForm/types";
import { FakeToolkitConfig } from "../../../types/ToolkitConfig";
import { estimateFeeForEachOperation } from "../../../views/batch/batchUtils";
import assetsSlice from "../assetsSlice";
import { RootState } from "../store";

const { updateBatch: addToBatch, batchSimulationEnd, batchSimulationStart } = assetsSlice.actions;
export const estimateAndUpdateBatch = (
  operations: OperationValue[],
  config: FakeToolkitConfig
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    if (operations.length === 0) {
      throw new Error("Can't add empty list of operations to batch!");
    }

    const batches = getState().assets.batches;

    if (batches[config.pkh]?.isSimulating) {
      throw new Error(`Simulation already ongoing for ${config.pkh}`);
    }

    dispatch(batchSimulationStart({ pkh: config.pkh }));
    try {
      const operationsWithFee = await estimateFeeForEachOperation(operations, config);
      dispatch(addToBatch({ pkh: config.pkh, items: operationsWithFee }));
    } catch (error) {
      dispatch(batchSimulationEnd({ pkh: config.pkh }));
      throw error;
    }

    dispatch(batchSimulationEnd({ pkh: config.pkh }));
  };
};
