import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { AccountOperations } from "../../../components/sendForm/types";
import { TezosNetwork } from "../../../types/Network";
import { estimate } from "../../tezos";
import assetsSlice from "../slices/assetsSlice";
import { RootState } from "../store";

export const estimateAndUpdateBatch = (
  operations: AccountOperations,
  network: TezosNetwork
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async dispatch => {
    // check that the operation can be executed at least on its own
    await estimate(operations, network);
    dispatch(assetsSlice.actions.addToBatch(operations));
  };
};
