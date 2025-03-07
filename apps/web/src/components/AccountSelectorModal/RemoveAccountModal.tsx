import { useDynamicModalContext } from "@umami/components";
import { type LedgerAccount, type SecretKeyAccount, type SocialAccount } from "@umami/core";
import { logout, useAppSelector, useRemoveAccount } from "@umami/state";

import { persistor } from "../../utils/persistor";
import { ConfirmationModal } from "../ConfirmationModal";

type RemoveAccountModalProps = {
  account: SocialAccount | LedgerAccount | SecretKeyAccount;
};

export const handleRemoveDefaultAccount = async () => {
  persistor && (await logout(persistor));
};

export const getRemoveDefaultAccountDescription = (type: string): string => {
  const isMnemonic = type.toLowerCase().includes("seedphrase");
  let description =
    "Removing your default account will off-board you from Umami.\n\n" +
    "This will remove all personal data (including saved contacts, password and accounts) from your device. \n\n" +
    "Backup your data before proceeding.";
  description =
    description +
    (isMnemonic
      ? "\n\n<b>Make sure your mnemonic phrase is securely saved. Losing this phrase could result in permanent loss of access to your data.</b>"
      : "");
  return description;
};

export const RemoveAccountModal = ({ account }: RemoveAccountModalProps) => {
  const isDefaultAccount = useAppSelector(
    state => state.accounts.defaultAccount?.address.pkh === account.address.pkh
  );
  const { goBack, onClose } = useDynamicModalContext();
  const removeAccount = useRemoveAccount();
  let description =
    "Are you sure you want to remove this account? You will need to manually import it again.";
  let buttonLabel = "Remove";

  if (isDefaultAccount) {
    description = getRemoveDefaultAccountDescription(account.type);
    buttonLabel = "Remove & off-board";
  }

  const handleRemoveAccount = async (
    isDefaultAccount: boolean,
    account: SocialAccount | LedgerAccount | SecretKeyAccount
  ) => {
    if (isDefaultAccount) {
      await handleRemoveDefaultAccount();
    } else {
      removeAccount(account);
      onClose();
      goBack();
    }
  };

  return (
    <ConfirmationModal
      buttonLabel={buttonLabel}
      closeOnSubmit={isDefaultAccount}
      description={description}
      onSubmit={async () => await handleRemoveAccount(isDefaultAccount, account)}
      title="Remove account"
    />
  );
};
