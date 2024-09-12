import { useToast } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { DEFAULT_ACCOUNT_LABEL, type MnemonicAccount } from "@umami/core";
import { useAsyncActionHandler, useDeriveMnemonicAccount } from "@umami/state";

import { MasterPasswordModal } from "../../MasterPasswordModal";
import { NameAccountModal } from "../../NameAccountModal";

type DeriveMnemonicAccountModalProps = {
  account: MnemonicAccount;
};

export const DeriveMnemonicAccountModal = ({ account }: DeriveMnemonicAccountModalProps) => {
  const { goToIndex, openWith } = useDynamicModalContext();

  const { handleAsyncAction } = useAsyncActionHandler();
  const deriveMnemonicAccount = useDeriveMnemonicAccount();
  const toast = useToast();

  const handleNameSubmit = ({ accountName }: { accountName: string }) => {
    const handlePasswordSubmit = ({ password }: { password: string }) =>
      handleAsyncAction(
        async () => {
          await deriveMnemonicAccount({
            fingerPrint: account.seedFingerPrint,
            password,
            label: accountName.trim() || DEFAULT_ACCOUNT_LABEL,
          });
          goToIndex(0);

          toast({
            description: `New account created! Successfully derived account from ${account.seedFingerPrint}`,
          });
        },
        { title: "Failed to derive new account" }
      );

    return openWith(<MasterPasswordModal onSubmit={handlePasswordSubmit} />);
  };

  return (
    <NameAccountModal
      onSubmit={handleNameSubmit}
      subtitle={`Name the new account derived from seedphrase ${account.seedFingerPrint}`}
    />
  );
};
