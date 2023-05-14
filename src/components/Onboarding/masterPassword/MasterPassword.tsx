import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import {
  useCheckPasswordValidity,
  useRestoreSecret,
  useRestoreLedger,
} from "../../../utils/hooks/accountHooks";
import {
  Step,
  TemporaryAccountConfig,
  TemporaryLedgerAccountConfig,
  TemporaryMnemonicAccountConfig,
} from "../useOnboardingModal";
import { EnterAndComfirmPassword } from "./password/EnterAndConfirmPassword";
import EnterPassword from "./password/EnterPassword";

export const MasterPassword = ({
  setStep,
  config,
  onClose,
}: {
  setStep: (step: Step) => void;
  config: TemporaryAccountConfig;
  onClose: () => void;
}) => {
  const restoreSecret = useRestoreSecret();
  const restoreLedger = useRestoreLedger();
  const checkPassword = useCheckPasswordValidity();
  const passwordHasBeenSet = checkPassword !== null;

  const [isLoading, setIsloading] = useState(false);
  const toast = useToast();
  const handleSubmit = async (password: string) => {
    setIsloading(true);
    try {
      if (passwordHasBeenSet) {
        await checkPassword(password);
      }

      if (config instanceof TemporaryMnemonicAccountConfig) {
        if (!config.seedphrase) throw new Error("Seedphrase not set");
        await restoreSecret(config.seedphrase, password, config.label);
      }

      if (config instanceof TemporaryLedgerAccountConfig) {
        if (!config.derivationPath) throw new Error("DerivationPath not set");
        if (!config.pk) throw new Error("Pk not set");
        if (!config.pkh) throw new Error("Pkh not set");
        await restoreLedger(
          config.derivationPath,
          config.pk,
          config.pkh,
          config.label
        );
      }

      toast({ title: "success" });
      onClose();
    } catch (error: any) {
      toast({ title: "error", description: error.message });
    }
    setIsloading(false);
  };

  if (passwordHasBeenSet) {
    return <EnterPassword isLoading={isLoading} onSubmit={handleSubmit} />;
  }
  return (
    <EnterAndComfirmPassword isLoading={isLoading} onSubmit={handleSubmit} />
  );
};

export default MasterPassword;
