import { AnyAction, ThunkAction } from "@reduxjs/toolkit";

import { AccountOperations } from "../../../types/AccountOperations";
import { Network } from "../../../types/Network";
import { estimate } from "../../tezos";
import { batchesActions } from "../slices/batches";
import { RootState } from "../store";

export const estimateAndUpdateBatch =
  (
    operations: AccountOperations,
    network: Network
  ): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
  async dispatch => {
    // check that the operation can be executed at least on its own
    await estimate(operations, network);
    dispatch(batchesActions.add({ operations, network }));
  };
