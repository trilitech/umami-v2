import { useToast } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { DEFAULT_ACCOUNT_LABEL, type MnemonicAccount } from "@umami/core";
import { useAsyncActionHandler, useDeriveMnemonicAccount } from "@umami/state";
import { useCallback } from "react";

import { MasterPasswordModal } from "../MasterPasswordModal";
import { NameAccountModal } from "../NameAccountModal";

type DeriveMnemonicAccountProps = {
  account: MnemonicAccount;
};

export const DeriveMnemonicAccount = ({ account }: DeriveMnemonicAccountProps) => {
  const { onClose, allFormValues } = useDynamicModalContext();

  const { handleAsyncAction } = useAsyncActionHandler();
  const toast = useToast();
  const deriveMnemonicAccount = useDeriveMnemonicAccount();

  const handlePasswordSubmit = useCallback(
    (password: string) =>
      handleAsyncAction(
        async () => {
          await deriveMnemonicAccount({
            fingerPrint: account.seedFingerPrint,
            password,
            label: allFormValues.accountName?.trim() || DEFAULT_ACCOUNT_LABEL,
          });
          onClose();

          toast({
            description: `New account created! Successfully derived account from ${account.seedFingerPrint}`,
          });
        },
        { title: "Failed to derive new account" }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allFormValues, account]
  );

  return (
    <NameAccountModal
      nextModal={<MasterPasswordModal onSubmit={handlePasswordSubmit} />}
      subtitle={`Name the new account derived from seedphrase ${account.seedFingerPrint}`}
    />
  );
};
