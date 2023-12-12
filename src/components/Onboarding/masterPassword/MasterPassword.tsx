import { useToast } from "@chakra-ui/react";

import { EnterAndConfirmPassword } from "./password/EnterAndConfirmPassword";
import { EnterPassword } from "./password/EnterPassword";
import { useCheckPasswordValidity } from "../../../utils/hooks/getAccountDataHooks";
import {
  useRestoreFromMnemonic,
  useRestoreFromSecretKey,
} from "../../../utils/hooks/setAccountDataHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { MasterPasswordStep } from "../useOnboardingModal";

export const MasterPassword = ({
  account,
  onClose,
}: {
  account: MasterPasswordStep["account"];
  onClose: () => void;
}) => {
  const restoreFromMnemonic = useRestoreFromMnemonic();
  const restoreFromSecretKey = useRestoreFromSecretKey();
  const checkPassword = useCheckPasswordValidity();
  const passwordHasBeenSet = checkPassword !== null;

  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const toast = useToast();
  const handleSubmit = (password: string) =>
    handleAsyncAction(async () => {
      if (passwordHasBeenSet) {
        await checkPassword(password);
      }
      switch (account.type) {
        case "secret_key":
          await restoreFromSecretKey(account.secretKey, password, account.label);
          break;
        case "mnemonic":
          await restoreFromMnemonic(
            account.mnemonic,
            password,
            account.label,
            account.derivationPath
          );
      }
      toast({ description: "Account successfully created!", status: "success" });
      onClose();
    });

  if (passwordHasBeenSet) {
    return <EnterPassword isLoading={isLoading} onSubmit={handleSubmit} />;
  }
  return <EnterAndConfirmPassword isLoading={isLoading} onSubmit={handleSubmit} />;
};
