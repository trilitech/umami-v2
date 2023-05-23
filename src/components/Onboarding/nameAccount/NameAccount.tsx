import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAccounts } from "../../../utils/hooks/accountHooks";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import {
  Step,
  StepType,
  TemporaryAccountConfig,
  TemporaryLedgerAccountConfig,
} from "../useOnboardingModal";
import NameAccountDisplay from "./NameAccountDisplay";

export const NameAccount = ({
  setStep,
  config,
}: {
  setStep: (step: Step) => void;
  config: TemporaryAccountConfig;
}) => {
  const accounts = useAccounts();
  const onSubmit = (p: { accountName: string }) => {
    if (p.accountName.trim().length > 0) {
      config.label = p.accountName.trim();
    } else {
      config.label = `Account ${accounts.length + 1}`;
    }
    if (config instanceof TemporaryLedgerAccountConfig) {
      setStep({ type: StepType.masterPassword, config: config });
    } else {
      setStep({ type: StepType.derivationPath, config: config });
    }
  };

  return (
    <NameAccountDisplay
      subtitle="Please choose a name for your first account. You can edit your account name later."
      onSubmit={onSubmit}
    />
  );
};

export default NameAccount;
