import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { AccountType, SocialAccount } from "../../../types/Account";
import accountsSlice from "../accountsSlice";
import { RootState } from "../store";

const { add } = accountsSlice.actions;

export const restoreAccountsFromSocial = (
  pk: string,
  pkh: string,
  label: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    const account: SocialAccount = {
      type: AccountType.SOCIAL,
      pk: pk,
      pkh: pkh,
      idp: "google",
      label,
    };
    dispatch(add([account]));
  };
};
