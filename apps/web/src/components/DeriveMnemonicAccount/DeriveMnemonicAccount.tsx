import { useToast } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { DEFAULT_ACCOUNT_LABEL, type MnemonicAccount } from "@umami/core";
import { useAsyncActionHandler, useCurrentAccount, useDeriveMnemonicAccount } from "@umami/state";
import { useCallback } from "react";

import { MasterPasswordModal } from "../MasterPasswordModal";
import { NameAccountModal } from "../NameAccountModal";

export const DeriveMnemonicAccount = () => {
  const { onClose, allFormValues } = useDynamicModalContext();

  const { handleAsyncAction } = useAsyncActionHandler();
  const toast = useToast();
  const deriveMnemonicAccount = useDeriveMnemonicAccount();
  const currentAccount = useCurrentAccount() as MnemonicAccount;

  const handlePasswordSubmit = useCallback(
    (password: string) =>
      handleAsyncAction(
        async () => {
          await deriveMnemonicAccount({
            fingerPrint: currentAccount.seedFingerPrint,
            password,
            label: allFormValues.accountName?.trim() || DEFAULT_ACCOUNT_LABEL,
          });
          onClose();

          toast({
            description: `New account created! Successfully derived account from ${currentAccount.seedFingerPrint}`,
          });
        },
        { title: "Failed to derive new account" }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allFormValues, currentAccount]
  );

  return <NameAccountModal nextModal={<MasterPasswordModal onSubmit={handlePasswordSubmit} />} />;
};
