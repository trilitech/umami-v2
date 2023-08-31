import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { FormOperations } from "../../../components/sendForm/types";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { estimate } from "../../tezos";
import assetsSlice from "../slices/assetsSlice";
import { RootState } from "../store";

export const estimateAndUpdateBatch = (
  operations: FormOperations,
  network: TezosNetwork
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async dispatch => {
    // check that the operation can be executed at least on its own
    await estimate(operations, network);
    dispatch(assetsSlice.actions.addToBatch(operations));
  };
};
