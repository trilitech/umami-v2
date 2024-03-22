import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { RenameAccountModal } from "./RenameAccountModal";
import { Account } from "../../types/Account";
import { useImplicitAccounts } from "../../utils/hooks/getAccountDataHooks";
import { useRemoveAccount } from "../../utils/hooks/setAccountDataHooks";
import { ConfirmationModal } from "../ConfirmationModal";
import { DynamicModalContext } from "../DynamicModal";
import { RenameRemoveMenu } from "../RenameRemoveMenu";

export const RenameRemoveMenuSwitch: React.FC<{ account: Account }> = ({ account }) => {
  const { openWith, onClose: closeModal } = useContext(DynamicModalContext);
  const navigate = useNavigate();
  const isLastImplicitAccount = useImplicitAccounts().length === 1;
  const removeAccount = useRemoveAccount();

  let onRemove = undefined;
  switch (account.type) {
    case "secret_key":
    case "ledger":
    case "social":
      onRemove = () =>
        openWith(
          <ConfirmationModal
            buttonLabel={buttonLabel}
            description={description}
            onSubmit={() => {
              removeAccount(account);
              closeModal();
              navigate("/");
            }}
            title={title}
          />
        );
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
      "This will remove or reset all customized settings to their defaults. " +
      "Personal data (including saved contacts, password and accounts) won't be affected.";
    buttonLabel = "Remove & Off-board";
  }

  return (
    <RenameRemoveMenu
      onRemove={onRemove}
      onRename={() => openWith(<RenameAccountModal account={account} />)}
    />
  );
};
