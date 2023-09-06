import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { AccountOperations } from "../../../components/sendForm/types";
import { Network } from "../../../types/Network";
import { estimate } from "../../tezos";
import { RootState } from "../store";
import { batchesActions } from "../slices/batches";

export const estimateAndUpdateBatch = (
  operations: AccountOperations,
  network: Network
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async dispatch => {
    // check that the operation can be executed at least on its own
    await estimate(operations, network);
    dispatch(batchesActions.add({ operations, network }));
  };
};
