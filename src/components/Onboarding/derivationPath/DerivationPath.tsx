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
    formState: { isValid, isDirty },
  } = useForm<ConfirmDerivationPathFormValues>();
  const [useDefault, setUseDefault] = useState(true);

  const onSubmit = async (data: ConfirmDerivationPathFormValues) => {
    const derivationPath = useDefault ? defaultDerivationPathPattern : data.derivationPath;

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
                <Switch data-testid="switch" onChange={() => setUseDefault(!useDefault)} />
                <Text>Custom Path</Text>
              </HStack>
            </FormControl>
            <FormControl>
              {/* TODO: Add derivationPath regex matching check! */}
              <Input
                data-testid="custom-path"
                defaultValue={defaultDerivationPathPattern}
                isDisabled={useDefault}
                {...register("derivationPath", {
                  required: false,
                  pattern: {
                    value: validDerivationPathRegex,
                    message: "Please enter a valid derivation path",
                  },
                })}
              />
            </FormControl>
            <Button
              isDisabled={isDirty && !isValid}
              w="100%"
              size="lg"
              type="submit"
              title="Restore accounts"
              bg="umami.blue"
            >
              Continue
            </Button>
          </VStack>
        </Center>
      </form>
    </ModalContentWrapper>
  );
};

export default DerivationPath;
