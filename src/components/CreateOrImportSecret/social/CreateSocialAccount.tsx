import React from "react";
import { AccountType, SocialAccount } from "../../../types/Account";
import accountsSlice from "../../../utils/store/accountsSlice";
import { useAppDispatch } from "../../../utils/store/hooks";
import AccountNameForm from "../accountName/AccountNameForm";

const accountsActions = accountsSlice.actions;

const CreateSocialAccount = ({
  pk,
  pkh,
  onSuccess,
}: {
  pk: string;
  pkh: string;
  onSuccess: () => void;
}) => {
  const dispatch = useAppDispatch();

  return (
    <AccountNameForm
      isLoading={false}
      onSubmit={(label) => {
        const account: SocialAccount = {
          type: AccountType.SOCIAL,
          pk,
          pkh,
          idp: "google",
          label,
        };

        dispatch(accountsActions.add([account]));
        onSuccess();
      }}
    />
  );
};

export default CreateSocialAccount;
