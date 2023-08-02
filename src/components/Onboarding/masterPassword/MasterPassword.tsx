import { useToast } from "@chakra-ui/react";
import { useCheckPasswordValidity, useRestoreSecret } from "../../../utils/hooks/accountHooks";
import { useSafeLoading } from "../../../utils/hooks/useSafeLoading";
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

  const { isLoading, withLoading } = useSafeLoading();
  const toast = useToast();
  const handleSubmit = (password: string) =>
    withLoading(async () => {
      if (passwordHasBeenSet) {
        await checkPassword(password);
      }
      await restoreSecret(account.seedphrase, password, account.label, account.derivationPath);
      toast({ title: "Successful account restore" });
      onClose();
    });

  if (passwordHasBeenSet) {
    return <EnterPassword isLoading={isLoading} onSubmit={handleSubmit} />;
  }
  return <EnterAndConfirmPassword isLoading={isLoading} onSubmit={handleSubmit} />;
};

export default MasterPassword;
