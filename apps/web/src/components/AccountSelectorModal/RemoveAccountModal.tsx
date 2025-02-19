import { useDynamicModalContext } from "@umami/components";
import { type LedgerAccount, type SecretKeyAccount, type SocialAccount } from "@umami/core";
import { useImplicitAccounts, useRemoveAccount } from "@umami/state";

import { ConfirmationModal } from "../ConfirmationModal";

type RemoveAccountModalProps = {
  account: SocialAccount | LedgerAccount | SecretKeyAccount;
};

export const RemoveAccountModal = ({ account }: RemoveAccountModalProps) => {
  const { goBack, onClose } = useDynamicModalContext();
  const removeAccount = useRemoveAccount();

  const isLastImplicitAccount = useImplicitAccounts().length === 1;

  const handleRemoveAccount = () => {
    removeAccount(account);

    if (isLastImplicitAccount) {
      onClose();
      window.location.replace("/"); // TODO: fix for react-native
    } else {
      goBack();
    }
  };

  let description =
    "Are you sure you want to hide this account? You will need to manually import it again.";
  let buttonLabel = "Remove";

  if (isLastImplicitAccount) {
    description =
      "Removing your last account will off-board you from Umami. " +
      "This will remove or reset all customized settings to their defaults. " +
      "Personal data (including saved contacts, password and accounts) won't be affected.";
    buttonLabel = "Remove & off-board";
  }

  return (
    <ConfirmationModal
      buttonLabel={buttonLabel}
      closeOnSubmit={isLastImplicitAccount}
      description={description}
      onSubmit={handleRemoveAccount}
      title="Remove account"
    />
  );
};
