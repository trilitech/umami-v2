import { type Action, type ThunkAction } from "@reduxjs/toolkit";

import { type AccountOperations } from "../../../types/AccountOperations";
import { type Network } from "../../../types/Network";
import { estimate } from "../../tezos";
import { batchesActions } from "../slices/batches";
import { type RootState } from "../store";

export const estimateAndUpdateBatch =
  (
    operations: AccountOperations,
    network: Network
  ): ThunkAction<Promise<void>, RootState, unknown, Action> =>
  async dispatch => {
    // check that the operation can be executed at least on its own
    await estimate(operations, network);
    dispatch(batchesActions.add({ operations, network }));
  };
