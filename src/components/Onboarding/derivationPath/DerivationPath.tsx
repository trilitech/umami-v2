import { Button, FormControl, FormLabel, Text, Tooltip } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { SlashIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import {
  AVAILABLE_DERIVATION_PATHS,
  DEFAULT_DERIVATION_PATH,
  defaultDerivationPathPattern,
} from "../../../utils/account/derivationPathUtils";
import { ExternalLink } from "../../ExternalLink";
import { FormErrorMessage } from "../../FormErrorMessage";
import { Select } from "../../Select";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { DerivationPathStep, Step, StepType } from "../useOnboardingModal";

type ConfirmDerivationPathFormValues = {
  derivationPath: string;
};

/**
 * Component represents the derivation path step in the onboarding flow
 * It's used for ledger & mnemonic accounts
 *
 * @param goToStep - function to go to the next step.
 * @param account - ledger/mnemonic account data collected in previous steps.
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

  const onSubmit = ({ derivationPath }: ConfirmDerivationPathFormValues) => {
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

        <ExternalLink
          display="block"
          width="100%"
          marginTop="32px"
          textAlign="center"
          href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki"
        >
          <Tooltip
            backgroundColor="white"
            defaultIsOpen={false}
            hasArrow
            label="Derivation path is a set of directions that helps create different secret keys; it starts from a master key or seed."
          >
            <Text
              color={colors.blue}
              fontWeight={600}
              textDecoration="underline"
              _hover={{ textDecoration: "underline" }}
              size="sm"
            >
              What's a Derivation Path?
            </Text>
          </Tooltip>
        </ExternalLink>
      </form>
    </ModalContentWrapper>
  );
};
