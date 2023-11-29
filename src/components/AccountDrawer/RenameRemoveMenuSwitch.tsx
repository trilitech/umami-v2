import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { RenameAccountModal } from "./RenameAccountModal";
import { Account } from "../../types/Account";
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

  const onRemove = !removeAccountAction
    ? undefined
    : () => {
        openWith(
          <ConfirmationModal
            buttonLabel="Remove Account"
            description="Are you sure you want to remove this account?"
            onSubmit={() => {
              dispatch(removeAccountAction(account));
              closeModal();
              navigate("/");
            }}
            title="Remove Account"
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
