import { useToast } from "@chakra-ui/react";
import {
  useAsyncActionHandler,
  useIsPasswordSet,
  useRestoreFromMnemonic,
  useRestoreFromSecretKey,
  useValidateMasterPassword,
} from "@umami/state";
import { CustomError } from "@umami/utils";

import { type MasterPasswordStep } from "../OnboardingStep";
import { EnterAndConfirmPassword } from "./password/EnterAndConfirmPassword";
import { EnterPassword } from "./password/EnterPassword";

export const MasterPassword = ({
  account,
  onClose,
  onVerify,
}: {
  account?: MasterPasswordStep["account"];
  onClose?: () => void;
  onVerify?: (password: string) => void;
}) => {
  const restoreFromMnemonic = useRestoreFromMnemonic();
  const restoreFromSecretKey = useRestoreFromSecretKey();
  const checkPassword = useValidateMasterPassword();
  const passwordHasBeenSet = useIsPasswordSet();

  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const toast = useToast();

  const handleSubmit = (password: string) =>
    handleAsyncAction(async () => {
      await checkPassword?.(password);

      if (onVerify) {
        return onVerify(password);
      }

      if (!account) {
        throw new CustomError("No account data provided.");
      }

      switch (account.type) {
        case "secret_key":
          await restoreFromSecretKey(account.secretKey, password, account.label);
          break;
        case "mnemonic":
          await restoreFromMnemonic({
            ...account,
            password,
            curve: "ed25519", // TODO: add support for other curves
          });
      }
      toast({ description: "Account successfully created!", status: "success" });
      onClose?.();
    });

  if (passwordHasBeenSet) {
    return <EnterPassword isLoading={isLoading} onSubmit={handleSubmit} />;
  }
  return <EnterAndConfirmPassword isLoading={isLoading} onSubmit={handleSubmit} />;
};
