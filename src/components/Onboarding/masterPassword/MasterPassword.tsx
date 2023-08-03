import { useToast } from "@chakra-ui/react";
import { useCheckPasswordValidity, useRestoreSecret } from "../../../utils/hooks/accountHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { MasterPasswordStep } from "../useOnboardingModal";
import EnterAndConfirmPassword from "./password/EnterAndConfirmPassword";
import EnterPassword from "./password/EnterPassword";

export const MasterPassword = ({
  account,
  onClose,
}: {
  account: MasterPasswordStep["account"];
  onClose: () => void;
}) => {
  const restoreSecret = useRestoreSecret();
  const checkPassword = useCheckPasswordValidity();
  const passwordHasBeenSet = checkPassword !== null;

  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const toast = useToast();
  const handleSubmit = (password: string) =>
    handleAsyncAction(async () => {
      if (passwordHasBeenSet) {
        await checkPassword(password);
      }
      await restoreSecret(account.seedphrase, password, account.label, account.derivationPath);
      toast({ title: "Successful account restore", status: "success" });
      onClose();
    });

  if (passwordHasBeenSet) {
    return <EnterPassword isLoading={isLoading} onSubmit={handleSubmit} />;
  }
  return <EnterAndConfirmPassword isLoading={isLoading} onSubmit={handleSubmit} />;
};

export default MasterPassword;
