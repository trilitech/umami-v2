import { Button, Center, FormControl, Text, Switch, VStack, Input, HStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import ModalContentWrapper from "../ModalContentWrapper";
import { SupportedIcons } from "../../CircleIcon";
import { DerivationPathStep, Step, StepType } from "../useOnboardingModal";
import { useState } from "react";
import {
  defaultDerivationPathPattern,
  validDerivationPathRegex,
} from "../../../utils/account/derivationPathUtils";
import { FormErrorMessage } from "../../FormErrorMessage";

type ConfirmDerivationPathFormValues = {
  derivationPath: string;
};

export const DerivationPath = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: DerivationPathStep["account"];
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<ConfirmDerivationPathFormValues>({
    mode: "onBlur",
    defaultValues: { derivationPath: defaultDerivationPathPattern },
  });
  const [useDefault, setUseDefault] = useState(true);

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
      icon={SupportedIcons.diamont}
      title="Derivation Path"
      subtitle="Choose a custom derivation path or select the default derivation path and use the default key."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center>
          <VStack spacing={5}>
            <FormControl>
              <HStack spacing="10px">
                <Text fontWeight="bold">Default Path</Text>
                <Switch
                  data-testid="switch"
                  onChange={() => {
                    // set back to default
                    if (!useDefault) {
                      setValue("derivationPath", defaultDerivationPathPattern);
                    }
                    setUseDefault(!useDefault);
                  }}
                />
                <Text>Custom Path</Text>
              </HStack>
            </FormControl>
            <FormControl isInvalid={!isValid}>
              <Input
                data-testid="custom-path"
                variant="filled"
                isDisabled={useDefault}
                {...register("derivationPath", {
                  pattern: {
                    value: validDerivationPathRegex,
                    message: "Please enter a valid derivation path",
                  },
                })}
              />
              {errors.derivationPath && (
                <FormErrorMessage data-testid="error-message">
                  {errors.derivationPath.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <Button isDisabled={!isValid} w="100%" size="lg" type="submit">
              Continue
            </Button>
          </VStack>
        </Center>
      </form>
    </ModalContentWrapper>
  );
};

export default DerivationPath;
