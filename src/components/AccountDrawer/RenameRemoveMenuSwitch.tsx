import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { RenameAccountModal } from "./RenameAccountModal";
import { Account } from "../../types/Account";
import { useImplicitAccounts } from "../../utils/hooks/getAccountDataHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { remove as removeSecretKeyAccount } from "../../utils/redux/thunks/secretKeyAccount";
import { ConfirmationModal } from "../ConfirmationModal";
import { DynamicModalContext } from "../DynamicModal";
import { RenameRemoveMenu } from "../RenameRemoveMenu";

export const RenameRemoveMenuSwitch: React.FC<{ account: Account }> = ({ account }) => {
  const { openWith, onClose: closeModal } = useContext(DynamicModalContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLastImplicitAccount = useImplicitAccounts().length === 1;

  let removeAccountAction: any = undefined;

  switch (account.type) {
    case "secret_key":
      removeAccountAction = removeSecretKeyAccount;
      break;
    case "ledger":
    case "social":
      removeAccountAction = accountsSlice.actions.removeAccount(account);
      break;
    case "mnemonic":
    case "multisig":
  }

  const title = "Remove Account";
  let description = "Are you sure you want to remove this account?";
  let buttonLabel = "Remove Account";

  if (isLastImplicitAccount) {
    description =
      "Removing your last account will off-board you from Umami. " +
      "This will remove or reset all customised settings to their defaults. " +
      "Personal data (including saved contacts, password and accounts) won't be affected.";
    buttonLabel = "Remove & Off-board";
  }

  const onRemove = !removeAccountAction
    ? undefined
    : () => {
        openWith(
          <ConfirmationModal
            buttonLabel={buttonLabel}
            description={description}
            onSubmit={() => {
              dispatch(removeAccountAction(account));
              closeModal();
              navigate("/");
            }}
            title={title}
          />
        );
      };

  return (
    <RenameRemoveMenu
      onRemove={onRemove}
      onRename={() => openWith(<RenameAccountModal account={account} />)}
    />
  );
};
