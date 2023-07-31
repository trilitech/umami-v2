import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { Account, ImplicitAccount } from "../../../types/Account";
import { Operation } from "../../../types/Operation";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { operationsToBatchItems } from "../../../views/batch/batchUtils";
import assetsSlice from "../slices/assetsSlice";
import { RootState } from "../store";

export const estimateAndUpdateBatch = (
  sender: Account,
  signer: ImplicitAccount,
  operations: Operation[],
  network: TezosNetwork
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async dispatch => {
    const operationsWithFee = await operationsToBatchItems(operations, signer, network);
    dispatch(
      assetsSlice.actions.addToBatch({ pkh: sender.address.pkh, operations: operationsWithFee })
    );
  };
};
