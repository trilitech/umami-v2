import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import ModalContentWrapper from "../ModalContentWrapper";
import { DerivationPathStep, Step, StepType } from "../useOnboardingModal";
import {
  AVAILABLE_DERIVATION_PATHS,
  DEFAULT_DERIVATION_PATH,
  defaultDerivationPathPattern,
} from "../../../utils/account/derivationPathUtils";
import { FormErrorMessage } from "../../FormErrorMessage";
import SlashIcon from "../../../assets/icons/Slash";
import { Select } from "../../Select";

type ConfirmDerivationPathFormValues = {
  derivationPath: string;
};

/**
 * Component represents the derivation path step in the onboarding flow
 * It's used for ledger & mnemonic accounts
 *
 * @goToStep - function to go to the next step.
 * @account - ledger/mnemonic account data collected in previous steps.
 */
export const DerivationPath = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: DerivationPathStep["account"];
}) => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConfirmDerivationPathFormValues>({
    mode: "onBlur",
    defaultValues: { derivationPath: defaultDerivationPathPattern },
  });

  const onSubmit = async ({ derivationPath }: ConfirmDerivationPathFormValues) => {
    switch (account.type) {
      case "ledger":
        goToStep({ type: StepType.restoreLedger, account: { ...account, derivationPath } });
        break;
      case "mnemonic":
        goToStep({ type: StepType.masterPassword, account: { ...account, derivationPath } });
        break;
    }
  };

  return (
    <ModalContentWrapper
      icon={<SlashIcon />}
      subtitle="Choose a custom derivation path or select the default derivation path and use the default key."
      title="Derivation Path"
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <FormControl marginBottom="20px">
          <FormLabel>Select Path</FormLabel>
          <Select
            onChange={newVal => setValue("derivationPath", newVal)}
            options={AVAILABLE_DERIVATION_PATHS}
            selected={DEFAULT_DERIVATION_PATH}
          />
          {errors.derivationPath && (
            <FormErrorMessage data-testid="error-message">
              {errors.derivationPath.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <Button width="100%" marginTop="12px" size="lg" type="submit">
          Continue
        </Button>
      </form>
    </ModalContentWrapper>
  );
};

export default DerivationPath;
