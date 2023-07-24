import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { Account, ImplicitAccount } from "../../../types/Account";
import { Operation } from "../../../types/Operation";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { operationsToBatchItems } from "../../../views/batch/batchUtils";
import assetsSlice from "../slices/assetsSlice";
import { RootState } from "../store";

const { updateBatch: addToBatch, batchSimulationEnd, batchSimulationStart } = assetsSlice.actions;
export const estimateAndUpdateBatch = (
  sender: Account,
  signer: ImplicitAccount,
  operations: Operation[],
  network: TezosNetwork
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    if (operations.length === 0) {
      throw new Error("Can't add empty list of operations to batch!");
    }

    const batches = getState().assets.batches;

    if (batches[sender.address.pkh]?.isSimulating) {
      throw new Error(`Simulation already ongoing for ${sender.address.pkh}`);
    }

    dispatch(batchSimulationStart({ pkh: sender.address.pkh }));
    try {
      const items = await operationsToBatchItems(operations, sender, signer, network);
      dispatch(addToBatch({ pkh: sender.address.pkh, items }));
    } catch (error) {
      dispatch(batchSimulationEnd({ pkh: sender.address.pkh }));
      throw error;
    }

    dispatch(batchSimulationEnd({ pkh: sender.address.pkh }));
  };
};
