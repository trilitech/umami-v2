import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { FormOperations } from "../../../components/sendForm/types";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { operationsToBatchItems } from "../../../views/batch/batchUtils";
import assetsSlice from "../slices/assetsSlice";
import { RootState } from "../store";

export const estimateAndUpdateBatch = (
  operations: FormOperations,
  network: TezosNetwork
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async dispatch => {
    const operationsWithFee = await operationsToBatchItems(operations, network);
    dispatch(
      assetsSlice.actions.addToBatch({
        pkh: operations.sender.address.pkh,
        operations: operationsWithFee,
      })
    );
  };
};
